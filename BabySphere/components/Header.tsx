import React from 'react';
import { Baby } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center gap-3 mb-8">
      <Baby className="w-8 h-8 text-blue-600" />
      <h1 className="text-2xl font-bold text-gray-900">Parent Wellness Tracker</h1>
    </header>
  );
}