import React, { useMemo } from 'react';
import { Card } from './ui/Card';
import { Project, Transaction, Budget, TransactionType } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  transactions: Transaction[];
  budgets: Budget[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
};

const ProjectCard: React.FC<{ project: Project; budget?: Budget; transactions: Transaction[] }> = ({ project, budget, transactions }) => {
  const projectMetrics = useMemo(() => {
    const projectTransactions = transactions.filter(t => t.projectId === project.id && t.type === TransactionType.Expense);
    const spent = projectTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const categorySpending = projectTransactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categorySpending)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
        
    const budgetAmount = budget?.cap_amount || 0;
    const progress = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;

    return { spent, topCategories, budgetAmount, progress };
  }, [project, budget, transactions]);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-zinc-800 truncate">{project.name}</h3>
      <p className="text-sm text-zinc-500 mb-4">Líder: {project.lead}</p>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="font-medium text-zinc-700">Gasto vs Presupuesto</span>
          <span className="font-semibold text-zinc-800">{formatCurrency(projectMetrics.spent)} / <span className="text-zinc-500">{formatCurrency(projectMetrics.budgetAmount)}</span></span>
        </div>
        <div className="w-full bg-zinc-200 rounded-full h-2.5">
          <div className="bg-magenta-600 h-2.5 rounded-full" style={{ width: `${projectMetrics.progress}%` }}></div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-zinc-700 mb-2">Top Categorías de Gasto</h4>
        {projectMetrics.topCategories.length > 0 ? (
          <ul className="space-y-1 text-sm text-zinc-600">
            {projectMetrics.topCategories.map(([category, amount]) => (
              <li key={category} className="flex justify-between">
                <span>{category}</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </li>
            ))}
          </ul>
        ) : (
           <p className="text-sm text-zinc-500 italic">No hay gastos registrados.</p>
        )}
      </div>
    </Card>
  );
};

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, transactions, budgets }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-zinc-800 mb-8">Proyectos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => {
          const projectBudget = budgets.find(b => b.projectId === project.id);
          const projectTransactions = transactions.filter(t => t.projectId === project.id);
          return <ProjectCard key={project.id} project={project} budget={projectBudget} transactions={projectTransactions} />;
        })}
      </div>
    </div>
  );
};

export default ProjectsView;
