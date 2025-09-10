import React from 'react';
import { Card } from './ui/Card';
import { Transaction, TransactionStatus, TransactionType } from '../types';

interface TransactionsViewProps {
  transactions: Transaction[];
}

const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency, minimumFractionDigits: 0 }).format(value);
};

const statusPillClasses: Record<TransactionStatus, string> = {
  [TransactionStatus.Posted]: 'bg-green-100 text-green-800',
  [TransactionStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [TransactionStatus.Rejected]: 'bg-red-100 text-red-800',
};
const statusText: Record<TransactionStatus, string> = {
    [TransactionStatus.Posted]: 'Aprobada',
    [TransactionStatus.Pending]: 'Pendiente',
    [TransactionStatus.Rejected]: 'Rechazada',
}


const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-zinc-800 mb-8">Transacciones</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left text-zinc-600">
          <thead className="text-xs text-zinc-700 uppercase bg-zinc-50">
            <tr>
              <th scope="col" className="px-6 py-3">Fecha</th>
              <th scope="col" className="px-6 py-3">Descripción / Proveedor</th>
              <th scope="col" className="px-6 py-3">Categoría</th>
              <th scope="col" className="px-6 py-3">Monto</th>
              <th scope="col" className="px-6 py-3">Estado</th>
              <th scope="col" className="px-6 py-3">Creado por</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="bg-white border-b hover:bg-zinc-50">
                <td className="px-6 py-4">{t.date}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-900">{t.description}</div>
                  <div className="text-zinc-500">{t.vendor}</div>
                  {t.policyViolations && t.policyViolations.length > 0 && (
                    <div className="text-xs text-red-600 mt-1 italic">
                        {t.policyViolations.join(' ')}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">{t.category}</td>
                <td className={`px-6 py-4 font-medium ${t.type === TransactionType.Income ? 'text-green-600' : 'text-zinc-900'}`}>
                  {formatCurrency(t.amount, t.currency)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusPillClasses[t.status]}`}>
                    {statusText[t.status]}
                  </span>
                </td>
                <td className="px-6 py-4">{t.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default TransactionsView;