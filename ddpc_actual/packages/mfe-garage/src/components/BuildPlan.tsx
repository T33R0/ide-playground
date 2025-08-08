// Build Plan Component - Contract-First Implementation
// Uses exact database field names and TypeScript contracts

import React, { useState, useEffect } from 'react';
import { BuildPlanService } from '../services/buildPlanService';

// Local interfaces matching exact database schema
interface BuildPart {
  build_id: number;
  garage_id: number;
  part_name: string;
  part_brand: string;
  category: string;
  status: 'planned' | 'ordered' | 'installed' | 'removed';
  date_added: string; // ISO datetime string
  installation_date: string; // ISO date string
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

interface BuildPlanProps {
  vehicle: UserVehicle;
  onClose: () => void;
}

interface BuildPartFormData {
  part_name: string;
  part_brand: string;
  category: string;
  status: BuildPart['status'];
  installation_date: string;
}

const BuildPlanComponent: React.FC<BuildPlanProps> = ({ vehicle, onClose }) => {
  const [parts, setParts] = useState<BuildPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPart, setEditingPart] = useState<BuildPart | null>(null);
  const [formData, setFormData] = useState<BuildPartFormData>({
    part_name: '',
    part_brand: '',
    category: 'Engine',
    status: 'planned',
    installation_date: ''
  });

  const categories = BuildPlanService.getBuildCategories();
  const statusOptions = BuildPlanService.getStatusOptions();

  useEffect(() => {
    loadBuildParts();
  }, [vehicle.garage_id]);

  const loadBuildParts = async () => {
    try {
      setLoading(true);
      const buildParts = await BuildPlanService.getBuildParts(vehicle.garage_id);
      setParts(buildParts.sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime()));
    } catch (error) {
      console.error('Error loading build parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPart) {
        // Update existing part
        const updatedPart = await BuildPlanService.updateBuildPart({
          ...editingPart,
          ...formData
        });
        setParts(prev => prev.map(p => p.build_id === updatedPart.build_id ? updatedPart : p));
        setEditingPart(null);
      } else {
        // Add new part
        const newPart = await BuildPlanService.addBuildPart({
          garage_id: vehicle.garage_id,
          date_added: new Date().toISOString(),
          ...formData
        });
        setParts(prev => [newPart, ...prev]);
      }
      
      setFormData({
        part_name: '',
        part_brand: '',
        category: 'Engine',
        status: 'planned',
        installation_date: ''
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving build part:', error);
    }
  };

  const handleEdit = (part: BuildPart) => {
    setEditingPart(part);
    setFormData({
      part_name: part.part_name,
      part_brand: part.part_brand,
      category: part.category,
      status: part.status,
      installation_date: part.installation_date
    });
    setShowForm(true);
  };

  const handleDelete = async (buildId: number) => {
    if (window.confirm('Are you sure you want to delete this build part?')) {
      try {
        await BuildPlanService.deleteBuildPart(buildId);
        setParts(prev => prev.filter(part => part.build_id !== buildId));
      } catch (error) {
        console.error('Error deleting build part:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPart(null);
    setFormData({
      part_name: '',
      part_brand: '',
      category: 'Engine',
      status: 'planned',
      installation_date: ''
    });
  };

  const getStatusBadge = (status: BuildPart['status']) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption : { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const buildSummary = {
    total: parts.length,
    installed: parts.filter(p => p.status === 'installed').length,
    planned: parts.filter(p => p.status === 'planned').length,
    ordered: parts.filter(p => p.status === 'ordered').length,
    progress: parts.length > 0 ? Math.round((parts.filter(p => p.status === 'installed').length / parts.length) * 100) : 0
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Build Plan - {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            </h2>
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span>{buildSummary.total} total parts</span>
              <span>{buildSummary.installed} installed</span>
              <span>{buildSummary.ordered} ordered</span>
              <span>{buildSummary.planned} planned</span>
              <span className="font-medium">{buildSummary.progress}% complete</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Build Progress</span>
            <span>{buildSummary.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${buildSummary.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Add New Part Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ Add Build Part'}
          </button>
        </div>

        {/* Add/Edit Part Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">
              {editingPart ? 'Edit Build Part' : 'Add New Build Part'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Part Name *
                </label>
                <input
                  type="text"
                  value={formData.part_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, part_name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Cold Air Intake"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  value={formData.part_brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, part_brand: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., K&N, Borla, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
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
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as BuildPart['status'] }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Installation Date
                </label>
                <input
                  type="date"
                  value={formData.installation_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, installation_date: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                {editingPart ? 'Update Part' : 'Add Part'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Build Parts List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading build parts...</p>
          </div>
        ) : parts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No build parts found.</p>
            <p className="text-sm text-gray-500 mt-1">Add your first part to start building your dream car.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map(category => {
              const categoryParts = parts.filter(part => part.category === category);
              if (categoryParts.length === 0) return null;
              
              return (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900">{category}</h3>
                  <div className="space-y-2">
                    {categoryParts.map((part) => {
                      const statusBadge = getStatusBadge(part.status);
                      return (
                        <div key={part.build_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-gray-900">{part.part_name}</h4>
                              {part.part_brand && (
                                <span className="text-sm text-gray-600">by {part.part_brand}</span>
                              )}
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                {statusBadge.label}
                              </span>
                            </div>
                            <div className="flex gap-4 text-xs text-gray-500 mt-1">
                              <span>Added: {formatDate(part.date_added)}</span>
                              {part.installation_date && (
                                <span>Installed: {formatDate(part.installation_date)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(part)}
                              className="text-blue-500 hover:text-blue-700 text-sm"
                              title="Edit part"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(part.build_id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                              title="Delete part"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildPlanComponent;
