// Quick Add Maintenance Record Modal - Minimal friction UX
import React, { useState } from 'react';
import { MaintenanceService } from '../services/maintenanceService';

interface QuickAddMaintenanceProps {
  vehicleId: number;
  vehicleName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface QuickMaintenanceData {
  description: string;
  category: string;
  mileage: string;
  cost: string;
}

const QuickAddMaintenance: React.FC<QuickAddMaintenanceProps> = ({ 
  vehicleId, 
  vehicleName, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<QuickMaintenanceData>({
    description: '',
    category: 'Oil Change',
    mileage: '',
    cost: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = MaintenanceService.getMaintenanceCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setIsSubmitting(true);
    try {
      await MaintenanceService.addMaintenanceLog({
        garage_id: vehicleId,
        description: formData.description.trim(),
        category: formData.category,
        mileage: formData.mileage ? parseInt(formData.mileage) : 0,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        date_performed: new Date().toISOString().split('T')[0] // Today's date
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding maintenance record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Quick Add Maintenance
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Adding to: <span className="font-medium">{vehicleName}</span>
            </p>
          </div>

          {/* Service Description - Required */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Oil and filter change, Brake pad replacement..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Mileage and Cost - Optional but in same row */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mileage
              </label>
              <input
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                placeholder="125000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="85.50"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.description.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddMaintenance;
