import React from 'react';
import { Smile, Meh, Frown, Battery, BatteryCharging } from 'lucide-react';
import type { MoodType } from '../types/wellness';

interface MoodTrackerProps {
  onMoodSelect: (mood: MoodType) => void;
  onEnergySelect: (level: number) => void;
  selectedMood?: MoodType;
  energyLevel?: number;
}

export function MoodTracker({ onMoodSelect, onEnergySelect, selectedMood, energyLevel }: MoodTrackerProps) {
  const moods: { type: MoodType; icon: React.ReactNode; label: string }[] = [
    { type: 'happy', icon: <Smile className="w-8 h-8" />, label: 'Happy' },
    { type: 'content', icon: <Smile className="w-8 h-8" />, label: 'Content' },
    { type: 'neutral', icon: <Meh className="w-8 h-8" />, label: 'Neutral' },
    { type: 'stressed', icon: <Frown className="w-8 h-8" />, label: 'Stressed' },
    { type: 'exhausted', icon: <Battery className="w-8 h-8" />, label: 'Exhausted' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">How are you feeling?</h3>
        <div className="flex gap-4">
          {moods.map(({ type, icon, label }) => (
            <button
              key={type}
              onClick={() => onMoodSelect(type)}
              className={`p-4 rounded-lg flex flex-col items-center gap-2 transition-colors
                ${selectedMood === type ? 'bg-blue-100 text-blue-600' : 'bg-gray-50 hover:bg-gray-100'}`}
            >
              {icon}
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Energy Level</h3>
        <div className="flex items-center gap-4">
          <Battery className="w-6 h-6" />
          <input
            type="range"
            min="1"
            max="5"
            value={energyLevel || 3}
            onChange={(e) => onEnergySelect(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <BatteryCharging className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}