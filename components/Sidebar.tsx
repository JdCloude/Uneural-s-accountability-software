
import React from 'react';
import { NavItemKey } from '../types';
import { HomeIcon, TransactionsIcon, ProjectsIcon, BudgetsIcon, ReportsIcon, UsersIcon, ApprovalsIcon } from './icons';

interface SidebarProps {
  activeItem: NavItemKey;
  onItemClick: (item: NavItemKey) => void;
}

const navItems: { key: NavItemKey; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'dashboard', label: 'Inicio', icon: HomeIcon },
  { key: 'transactions', label: 'Transacciones', icon: TransactionsIcon },
  { key: 'projects', label: 'Proyectos', icon: ProjectsIcon },
  { key: 'budgets', label: 'Presupuestos', icon: BudgetsIcon },
  { key: 'reports', label: 'Reportes', icon: ReportsIcon },
  { key: 'users', label: 'Usuarios', icon: UsersIcon },
  { key: 'approvals', label: 'Aprobaciones', icon: ApprovalsIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-zinc-200">
         <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-magenta-500 rounded-lg"></div>
            <h1 className="text-xl font-bold text-zinc-800">UNeural</h1>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = activeItem === item.key;
          return (
            <a
              key={item.key}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onItemClick(item.key);
              }}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-magenta-50 text-magenta-600'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-zinc-200">
         <div className="flex items-center space-x-3">
            <img className="h-9 w-9 rounded-full" src="https://picsum.photos/id/237/100/100" alt="User" />
            <div>
                <p className="text-sm font-medium text-zinc-800">Johan C.</p>
                <p className="text-xs text-zinc-500">Contador</p>
            </div>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
