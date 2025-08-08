import React from 'react';
import { Link } from 'react-router-dom';
import { useTier, Tier } from 'shared_ui/context/tier-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared_ui/select";

const Header = () => {
  const { currentTier, setCurrentTier } = useTier();

  const handleTierChange = (value: string) => {
    setCurrentTier(value as Tier);
  };

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        DDPC
      </Link>
      <nav className="flex items-center gap-4">
        <Link to="/garage" className="mx-2 hover:text-gray-400">Garage</Link>
        <Link to="/tools" className="mx-2 hover:text-gray-400">Tools</Link>
        <Link to="/account" className="mx-2 hover:text-gray-400">Account</Link>
        <Select value={currentTier} onValueChange={handleTierChange}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Premium">Premium</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
            <SelectItem value="Free">Free</SelectItem>
          </SelectContent>
        </Select>
      </nav>
    </header>
  );
};

export default Header;