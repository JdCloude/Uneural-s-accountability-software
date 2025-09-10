
import React, { useMemo } from 'react';
import { Card } from './ui/Card';
import { Transaction, TransactionType, TransactionStatus, Budget } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const DashboardView: React.FC<DashboardViewProps> = ({ transactions, budgets }) => {
  const kpis = useMemo(() => {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0,0,0,0);

    const monthlyTransactions = transactions.filter(t => new Date(t.date) >= monthStart);

    const expense = monthlyTransactions
      .filter(t => t.type === TransactionType.Expense)
      .reduce((sum, t) => sum + t.amount, 0);

    const income = monthlyTransactions
      .filter(t => t.type === TransactionType.Income)
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingApprovals = transactions.filter(t => t.status === TransactionStatus.Pending).length;

    const totalBudget = budgets.reduce((sum, b) => sum + b.cap_amount, 0);
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent_amount, 0);
    const budgetExecution = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    return {
      expense,
      income,
      balance: income - expense,
      pendingApprovals,
      budgetExecution,
    };
  }, [transactions, budgets]);
  
  const chartData = useMemo(() => {
    return budgets.map(b => ({
      name: b.projectId || b.groupId || 'General',
      Presupuesto: b.cap_amount,
      Gasto: b.spent_amount,
    }));
  }, [budgets]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-zinc-800 mb-8">Inicio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-zinc-500">Gasto del Mes</h3>
          <p className="text-3xl font-semibold text-zinc-800 mt-1">{formatCurrency(kpis.expense)}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-zinc-500">Ingreso del Mes</h3>
          <p className="text-3xl font-semibold text-zinc-800 mt-1">{formatCurrency(kpis.income)}</p>
        </Card>
         <Card>
          <h3 className="text-sm font-medium text-zinc-500">Balance del Mes</h3>
          <p className={`text-3xl font-semibold mt-1 ${kpis.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(kpis.balance)}
          </p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-zinc-500">Pendientes de Aprobar</h3>
          <p className="text-3xl font-semibold text-magenta-600 mt-1">{kpis.pendingApprovals}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-zinc-800 mb-4">Ejecución Presupuestal</h3>
          <div className="w-full h-72">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${formatCurrency(value as number)}`} />
                  <Tooltip contentStyle={{ background: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }} formatter={(value) => formatCurrency(value as number)} />
                  <Legend wrapperStyle={{fontSize: "14px"}} />
                  <Bar dataKey="Presupuesto" fill="#f9a8d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Gasto" fill="#be185d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </div>
        </Card>
        <Card>
            <h3 className="text-lg font-semibold text-zinc-800 mb-4">Transacciones Recientes</h3>
            <div className="space-y-4">
                {transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-zinc-700">{t.description}</p>
                            <p className="text-xs text-zinc-500">{t.vendor} - {t.date}</p>
                        </div>
                        <p className={`font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-zinc-800'}`}>
                            {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
