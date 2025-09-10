import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Transaction, TransactionStatus, TransactionType } from '../types';
import { CheckIcon, XMarkIcon } from './icons';


interface ApprovalsViewProps {
  transactions: Transaction[];
  onApprovalAction: (transactionId: string, newStatus: TransactionStatus.Posted | TransactionStatus.Rejected) => void;
}

const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency, minimumFractionDigits: 0 }).format(value);
};

const ApprovalsView: React.FC<ApprovalsViewProps> = ({ transactions, onApprovalAction }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-zinc-800 mb-8">Aprobaciones Pendientes</h1>
      {transactions.length > 0 ? (
        <div className="space-y-4">
          {transactions.map(t => (
            <Card key={t.id} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-zinc-800">{t.description}</p>
                <p className="text-sm text-zinc-500">
                  {t.vendor} &bull; {t.date} &bull; Creado por {t.createdBy}
                </p>
                {t.policyViolations && t.policyViolations.length > 0 && (
                    <div className="mt-2 text-xs font-medium text-yellow-800 bg-yellow-100 inline-block px-2 py-1 rounded">
                        {t.policyViolations.join(' ')}
                    </div>
                )}
                <p className={`text-lg font-bold mt-2 ${t.type === TransactionType.Income ? 'text-green-600' : 'text-zinc-900'}`}>
                  {formatCurrency(t.amount, t.currency)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="secondary" 
                  onClick={() => onApprovalAction(t.id, TransactionStatus.Rejected)}
                  className="!px-3 !py-2"
                  aria-label="Rechazar"
                >
                  <XMarkIcon className="w-5 h-5"/>
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => onApprovalAction(t.id, TransactionStatus.Posted)}
                  className="!px-3 !py-2"
                  aria-label="Aprobar"
                >
                  <CheckIcon className="w-5 h-5"/>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-zinc-800">Todo al día</h3>
          <p className="text-zinc-500 mt-2">No hay transacciones pendientes de aprobación.</p>
        </Card>
      )}
    </div>
  );
};

export default ApprovalsView;