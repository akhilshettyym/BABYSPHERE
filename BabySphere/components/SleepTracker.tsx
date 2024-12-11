import React from 'react';
import { Moon, Sun } from 'lucide-react';
import type { SleepData } from '../types/wellness';

interface SleepTrackerProps {
  onSleepUpdate: (data: SleepData) => void;
  sleepData?: SleepData;
}

export function SleepTracker({ onSleepUpdate, sleepData }: SleepTrackerProps) {
  const handleSleepChange = (field: keyof SleepData, value: number) => {
    onSleepUpdate({
      ...sleepData!,
      [field]: value,
      date: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Sleep Duration</h3>
        <div className="flex items-center gap-4">
          <Moon className="w-6 h-6" />
          <input
            type="number"
            min="0"
            max="24"
            value={sleepData?.duration || 0}
            onChange={(e) => handleSleepChange('duration', Number(e.target.value))}
            className="w-24 px-3 py-2 border rounded-md"
          />
          <span>hours</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Sleep Quality</h3>
        <div className="flex items-center gap-4">
          <Sun className="w-6 h-6" />
          <input
            type="range"
            min="1"
            max="5"
            value={sleepData?.quality || 3}
            onChange={(e) => handleSleepChange('quality', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}