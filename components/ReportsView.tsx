import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const ReportsView: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-zinc-800 mb-8">Reportes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-zinc-800 mb-4">Reporte General de Transacciones</h3>
          <p className="text-sm text-zinc-500 mb-4">Exporta un listado completo de todas las transacciones en un período de tiempo.</p>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <label htmlFor="start-date-1" className="block text-xs font-medium text-zinc-600 mb-1">Fecha de Inicio</label>
              <input type="date" id="start-date-1" className="w-full p-2 border border-zinc-300 rounded-md text-sm focus:ring-magenta-500 focus:border-magenta-500"/>
            </div>
            <div className="flex-1">
              <label htmlFor="end-date-1" className="block text-xs font-medium text-zinc-600 mb-1">Fecha de Fin</label>
              <input type="date" id="end-date-1" className="w-full p-2 border border-zinc-300 rounded-md text-sm focus:ring-magenta-500 focus:border-magenta-500"/>
            </div>
          </div>
          <Button onClick={() => console.log('Exporting CSV...')} className="w-full">Generar y Exportar CSV</Button>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-zinc-800 mb-4">Reporte de Gastos por Proyecto</h3>
          <p className="text-sm text-zinc-500 mb-4">Analiza los gastos detallados para un proyecto específico.</p>
          <div className="mb-4">
            <label htmlFor="project-select" className="block text-xs font-medium text-zinc-600 mb-1">Seleccionar Proyecto</label>
            <select id="project-select" className="w-full p-2 border border-zinc-300 rounded-md text-sm focus:ring-magenta-500 focus:border-magenta-500">
              <option>Hackatón Septiembre</option>
              <option>Smart Cities 3D Modeling</option>
              <option>Serie Educativa IEEE</option>
            </select>
          </div>
          <Button onClick={() => console.log('Exporting CSV...')} className="w-full">Generar y Exportar CSV</Button>
        </Card>
      </div>
    </div>
  );
};

export default ReportsView;
