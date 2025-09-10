import React from 'react';
import { Card } from './ui/Card';
import { User, Role } from '../types';

interface UsersViewProps {
  users: User[];
}

const rolePillClasses: Record<Role, string> = {
  [Role.Admin]: 'bg-magenta-100 text-magenta-800',
  [Role.Accountant]: 'bg-blue-100 text-blue-800',
  [Role.Lead]: 'bg-green-100 text-green-800',
  [Role.Member]: 'bg-zinc-100 text-zinc-800',
  [Role.Viewer]: 'bg-gray-100 text-gray-800',
};

const roleText: Record<Role, string> = {
    [Role.Admin]: 'Admin',
    [Role.Accountant]: 'Contador',
    [Role.Lead]: 'Líder',
    [Role.Member]: 'Miembro',
    [Role.Viewer]: 'Observador',
};

const UsersView: React.FC<UsersViewProps> = ({ users }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-zinc-800 mb-8">Usuarios</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm text-left text-zinc-600">
          <thead className="text-xs text-zinc-700 uppercase bg-zinc-50">
            <tr>
              <th scope="col" className="px-6 py-3">Nombre</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white border-b hover:bg-zinc-50">
                <td className="px-6 py-4 font-medium text-zinc-900">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${rolePillClasses[user.role]}`}>
                    {roleText[user.role]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default UsersView;
