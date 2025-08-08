import React, { useState, useEffect } from 'react';
import { Button } from "shared_ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "shared_ui/card";
import { X, Plus, Car } from "lucide-react";

interface VehicleMake {
  id: string;
  name: string;
}

interface VehicleModel {
  id: string;
  name: string;
  years: string[];
  image: string;
}

interface VehicleData {
  makes: VehicleMake[];
  models: Record<string, VehicleModel[]>; // key is makeId
}

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (vehicle: {
    nickname: string;
    make: string;
    model: string;
    year: string;
    image: string;
  }) => void;
}

// Mock data - in a real app, this would come from an API
const MOCK_VEHICLE_DATA: VehicleData = {
  makes: [
    { id: 'toyota', name: 'Toyota' },
    { id: 'ford', name: 'Ford' },
    { id: 'bmw', name: 'BMW' },
    { id: 'honda', name: 'Honda' },
    { id: 'subaru', name: 'Subaru' },
  ],
  models: {
    'toyota': [
      { id: 'camry', name: 'Camry', years: ['2020', '2021', '2022'], image: '/assets/stock/toyota-camry.jpg' },
      { id: 'corolla', name: 'Corolla', years: ['2019', '2020', '2021', '2022'], image: '/assets/stock/toyota-corolla.jpg' },
      { id: 'rav4', name: 'RAV4', years: ['2019', '2020', '2021', '2022', '2023'], image: '/assets/stock/toyota-rav4.jpg' },
    ],
    'ford': [
      { id: 'f150', name: 'F-150', years: ['2018', '2019', '2020', '2021', '2022'], image: '/assets/stock/ford-f150.jpg' },
      { id: 'mustang', name: 'Mustang', years: ['2020', '2021', '2022'], image: '/assets/stock/ford-mustang.jpg' },
    ],
    'bmw': [
      { id: '3series', name: '3 Series', years: ['2019', '2020', '2021', '2022'], image: '/assets/stock/bmw-3series.jpg' },
      { id: 'x5', name: 'X5', years: ['2020', '2021', '2022', '2023'], image: '/assets/stock/bmw-x5.jpg' },
    ],
  }
};

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onAddVehicle,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [filteredModels, setFilteredModels] = useState<VehicleModel[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [vehicleImage, setVehicleImage] = useState<string>('/assets/vehicle-placeholder.jpg');

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedMake('');
      setSelectedModel('');
      setSelectedYear('');
      setNickname('');
      setVehicleImage('/assets/vehicle-placeholder.jpg');
    }
  }, [isOpen]);

  // Filter models based on selected make
  useEffect(() => {
    if (selectedMake) {
      const models = MOCK_VEHICLE_DATA.models[selectedMake] || [];
      setFilteredModels(models);
      setSelectedModel('');
      setSelectedYear('');
      setVehicleImage('/assets/vehicle-placeholder.jpg');
    }
  }, [selectedMake]);

  // Update available years when model is selected
  useEffect(() => {
    if (selectedMake && selectedModel) {
      const model = filteredModels.find(m => m.id === selectedModel);
      if (model) {
        setAvailableYears(model.years);
        setSelectedYear('');
        setVehicleImage(model.image);
      }
    }
  }, [selectedModel, selectedMake, filteredModels]);

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (nickname && selectedMake && selectedModel && selectedYear) {
      const makeName = MOCK_VEHICLE_DATA.makes.find(m => m.id === selectedMake)?.name || selectedMake;
      const modelName = filteredModels.find(m => m.id === selectedModel)?.name || selectedModel;
      
      onAddVehicle({
        nickname: nickname || `${selectedYear} ${makeName} ${modelName}`,
        make: makeName,
        model: modelName,
        year: selectedYear,
        image: vehicleImage,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add a Vehicle</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-6">
            {[1, 2].map((stepNum) => (
              <div key={stepNum} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {stepNum}
                </div>
                <span className="text-xs mt-1">
                  {stepNum === 1 ? 'Vehicle' : 'Details'}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Select Make, Model, Year */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Make</label>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="">Select Make</option>
                  {MOCK_VEHICLE_DATA.makes.map((make) => (
                    <option key={make.id} value={make.id}>
                      {make.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedMake}
                  className="w-full p-2 border rounded-md bg-background disabled:opacity-50"
                >
                  <option value="">Select Model</option>
                  {filteredModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  disabled={!selectedModel}
                  className="w-full p-2 border rounded-md bg-background disabled:opacity-50"
                >
                  <option value="">Select Year</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleNext}
                  disabled={!selectedMake || !selectedModel || !selectedYear}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Add Nickname and Confirm */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-48 h-32 mb-4 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={vehicleImage}
                    alt="Vehicle preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">
                    {selectedYear} {
                      MOCK_VEHICLE_DATA.makes.find(m => m.id === selectedMake)?.name
                    } {
                      filteredModels.find(m => m.id === selectedModel)?.name
                    }
                  </h3>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Give it a nickname (optional)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g., My Daily Driver"
                  className="w-full p-2 border rounded-md bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank to use the default name
                </p>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleSubmit}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Garage
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;
