import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import InputPane from './components/InputPane';
import DashboardView from './components/DashboardView';
import TransactionsView from './components/TransactionsView';
import ProjectsView from './components/ProjectsView';
import BudgetsView from './components/BudgetsView';
import ReportsView from './components/ReportsView';
import UsersView from './components/UsersView';
import ApprovalsView from './components/ApprovalsView';
import { Transaction, NavItemKey, Budget, User, Project, TransactionStatus, Currency, TransactionType } from './types';
import { processAccountingData } from './services/geminiService';
import { MOCK_TRANSACTIONS, MOCK_BUDGETS, MOCK_USERS, MOCK_PROJECTS } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<NavItemKey>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessTransaction = useCallback(async (file: File | null, text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const extractedData = await processAccountingData(file, text);
      
      let newTransaction: Transaction = {
        id: `txn_${Date.now()}`,
        ...extractedData,
      } as Transaction;

      // --- AGENT POLICY LOGIC ---
      const policyViolations: string[] = [];
      let finalStatus = TransactionStatus.Pending;

      // Policy 1: Mandatory approval for amounts > 300,000 COP
      if (newTransaction.type === TransactionType.Expense && newTransaction.amount > 300000 && newTransaction.currency === Currency.COP) {
          policyViolations.push('Requiere aprobación: monto superior a 300.000 COP.');
      }

      // Policy 2: Block if budget is exceeded by > 10%
      if (newTransaction.projectId && newTransaction.type === TransactionType.Expense) {
          const projectBudget = budgets.find(b => b.projectId === newTransaction.projectId);
          if (projectBudget) {
              const newSpentAmount = projectBudget.spent_amount + newTransaction.amount;
              const budgetThreshold = projectBudget.cap_amount * 1.10;
              if (newSpentAmount > budgetThreshold) {
                  finalStatus = TransactionStatus.Rejected;
                  policyViolations.push(`Rechazado: Excede el presupuesto del proyecto en más del 10%.`);
              }
          }
      }
      
      newTransaction = {
          ...newTransaction,
          status: finalStatus,
          policyViolations,
      }

      setTransactions(prev => [newTransaction, ...prev]);

    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [budgets]);

  const handleApprovalAction = useCallback((transactionId: string, newStatus: TransactionStatus.Posted | TransactionStatus.Rejected) => {
    let approvedTransaction: Transaction | undefined;
    
    setTransactions(prev => {
        const newTransactions = prev.map(t => {
            if (t.id === transactionId) {
                const updatedTransaction = { ...t, status: newStatus };
                if (newStatus === TransactionStatus.Posted) {
                    approvedTransaction = updatedTransaction;
                }
                return updatedTransaction;
            }
            return t;
        });
        return newTransactions;
    });

    // Update budget if a transaction was approved
    if (approvedTransaction && approvedTransaction.type === TransactionType.Expense && (approvedTransaction.projectId || approvedTransaction.groupId)) {
        setBudgets(prevBudgets => prevBudgets.map(b => {
            if (b.projectId === approvedTransaction?.projectId || b.groupId === approvedTransaction?.groupId) {
                return { ...b, spent_amount: b.spent_amount + approvedTransaction.amount };
            }
            return b;
        }));
    }
  }, []);
  
  const renderActiveView = () => {
    switch(activeView) {
      case 'dashboard':
        return <DashboardView transactions={transactions} budgets={budgets} />;
      case 'transactions':
        return <TransactionsView transactions={transactions} />;
      case 'projects':
        return <ProjectsView projects={projects} transactions={transactions} budgets={budgets} />;
      case 'budgets':
        return <BudgetsView budgets={budgets} />;
      case 'reports':
        return <ReportsView />;
      case 'users':
        return <UsersView users={users} />;
      case 'approvals':
        const pendingTransactions = transactions.filter(t => t.status === TransactionStatus.Pending);
        return <ApprovalsView transactions={pendingTransactions} onApprovalAction={handleApprovalAction} />;
      default:
        return <DashboardView transactions={transactions} budgets={budgets} />;
    }
  }

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-800">
      <Sidebar activeItem={activeView} onItemClick={setActiveView} />
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto">
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-8" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            {renderActiveView()}
        </div>
        <InputPane onProcess={handleProcessTransaction} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default App;