// Maintenance Log Component - Contract-First Implementation
// Uses exact database field names and TypeScript contracts

import React, { useState, useEffect } from 'react';
import { MaintenanceService } from '../services/maintenanceService';

// Local interfaces matching exact database schema
interface MaintenanceLog {
  maint_id: number;
  garage_id: number;
  date_performed: string; // ISO date string
  mileage: number;
  description: string;
  cost: number;
  category: string;
}

interface UserVehicle {
  garage_id: number;
  user_id: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  nickname: string;
  status: 'active' | 'sold' | 'in-op';
  visibility: 'public' | 'private';
  ownership_date: string;
  photo_url: string;
}

interface MaintenanceLogProps {
  vehicle: UserVehicle;
  onClose: () => void;
}

interface MaintenanceFormData {
  date_performed: string;
  mileage: number;
  description: string;
  cost: number;
  category: string;
}

const MaintenanceLogComponent: React.FC<MaintenanceLogProps> = ({ vehicle, onClose }) => {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MaintenanceFormData>({
    date_performed: new Date().toISOString().split('T')[0],
    mileage: 0,
    description: '',
    cost: 0,
    category: 'Oil Change'
  });

  const categories = MaintenanceService.getMaintenanceCategories();

  useEffect(() => {
    loadMaintenanceLogs();
  }, [vehicle.garage_id]);

  const loadMaintenanceLogs = async () => {
    try {
      setLoading(true);
      const maintenanceLogs = await MaintenanceService.getMaintenanceLogs(vehicle.garage_id);
      setLogs(maintenanceLogs.sort((a, b) => new Date(b.date_performed).getTime() - new Date(a.date_performed).getTime()));
    } catch (error) {
      console.error('Error loading maintenance logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newLog = await MaintenanceService.addMaintenanceLog({
        garage_id: vehicle.garage_id,
        ...formData
      });
      setLogs(prev => [newLog, ...prev]);
      setFormData({
        date_performed: new Date().toISOString().split('T')[0],
        mileage: 0,
        description: '',
        cost: 0,
        category: 'Oil Change'
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding maintenance log:', error);
    }
  };

  const handleDelete = async (maintId: number) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await MaintenanceService.deleteMaintenanceLog(maintId);
        setLogs(prev => prev.filter(log => log.maint_id !== maintId));
      } catch (error) {
        console.error('Error deleting maintenance log:', error);
      }
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Maintenance Log - {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            </h2>
            <p className="text-gray-600">
              {logs.length} records • Total spent: {formatCurrency(totalCost)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Add New Record Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Maintenance Record'}
          </button>
        </div>

        {/* Add New Record Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Performed
                </label>
                <input
                  type="date"
                  value={formData.date_performed}
                  onChange={(e) => setFormData(prev => ({ ...prev, date_performed: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mileage
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Current mileage"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Describe the maintenance performed..."
                required
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Save Record
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Maintenance Records List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading maintenance records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No maintenance records found.</p>
            <p className="text-sm text-gray-500 mt-1">Add your first record to start tracking maintenance.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.maint_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {log.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(log.date_performed)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {log.mileage.toLocaleString()} miles
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {formatCurrency(log.cost)}
                      </span>
                    </div>
                    <p className="text-gray-900">{log.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(log.maint_id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                    title="Delete record"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceLogComponent;
