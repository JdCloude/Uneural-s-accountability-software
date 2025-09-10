import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Budget } from '../types';

interface BudgetsViewProps {
  budgets: Budget[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const BudgetsView: React.FC<BudgetsViewProps> = ({ budgets }) => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-800">Presupuestos</h1>
        <Button onClick={() => console.log('Crear presupuesto')}>
          Crear Presupuesto
        </Button>
      </div>
      
      <Card>
        <div className="space-y-6">
          {budgets.map(budget => {
            const remaining = budget.cap_amount - budget.spent_amount;
            const progress = budget.cap_amount > 0 ? (budget.spent_amount / budget.cap_amount) * 100 : 0;
            return (
              <div key={budget.id}>
                <div className="mb-2">
                  <h3 className="text-md font-semibold text-zinc-800">{budget.projectId || budget.groupId}</h3>
                  <p className="text-sm text-zinc-500">Período: {budget.period}</p>
                </div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-zinc-600">
                    <span className="font-bold text-zinc-800">{formatCurrency(budget.spent_amount)}</span> gastado
                  </span>
                  <span className="text-zinc-600">
                    <span className="font-bold text-zinc-800">{formatCurrency(remaining)}</span> restante
                  </span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-2.5">
                  <div className="bg-magenta-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                 <div className="flex justify-between items-center mt-1 text-xs text-zinc-500">
                    <span>0%</span>
                    <span>{formatCurrency(budget.cap_amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default BudgetsView;
