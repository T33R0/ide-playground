// Quick Add Build Part Modal - Minimal friction UX
import React, { useState } from 'react';
import { BuildPlanService } from '../services/buildPlanService';

interface QuickAddBuildPartProps {
  vehicleId: number;
  vehicleName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

interface QuickBuildPartData {
  part_name: string;
  category: string;
  status: 'planned' | 'ordered' | 'installed';
}

const QuickAddBuildPart: React.FC<QuickAddBuildPartProps> = ({ 
  vehicleId, 
  vehicleName, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<QuickBuildPartData>({
    part_name: '',
    category: 'Engine',
    status: 'planned'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = BuildPlanService.getBuildCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.part_name.trim()) return;

    setIsSubmitting(true);
    try {
      await BuildPlanService.addBuildPart({
        garage_id: vehicleId,
        part_name: formData.part_name.trim(),
        part_brand: '', // Optional field, empty for quick add
        category: formData.category,
        status: formData.status,
        date_added: new Date().toISOString(),
        installation_date: formData.status === 'installed' ? new Date().toISOString().split('T')[0] : ''
      });
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error adding build part:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Quick Add Build Part
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

          {/* Part Name - Required */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Part Name *
            </label>
            <input
              type="text"
              value={formData.part_name}
              onChange={(e) => setFormData(prev => ({ ...prev, part_name: e.target.value }))}
              placeholder="e.g., Cold Air Intake, Exhaust System..."
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

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-4">
              {(['planned', 'ordered', 'installed'] as const).map(status => (
                <label key={status} className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={formData.status === status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="mr-2"
                  />
                  <span className="text-sm capitalize">{status}</span>
                </label>
              ))}
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
              disabled={isSubmitting || !formData.part_name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Adding...' : 'Add Part'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddBuildPart;
