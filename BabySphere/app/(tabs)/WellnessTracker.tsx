import React, { useState, useEffect } from 'react';
import { MoodTracker } from '../../components/MoodTracker';
import { SleepTracker } from '../../components/SleepTracker';
import { WellnessInsights } from '../../components/WellnessInsights';
import { Header } from '../../components/Header';
import { storage } from '../../utils/storage';
import type { WellnessLog, MoodType, SleepData, CurrentLog } from '../../types/wellness';

function App() {
  const [logs, setLogs] = useState<WellnessLog[]>([]);
  const [currentLog, setCurrentLog] = useState<CurrentLog>({
    date: new Date().toISOString(),
  });

  useEffect(() => {
    const savedLogs = storage.getLogs();
    setLogs(savedLogs);
  }, []);

  useEffect(() => {
    storage.saveLogs(logs);
  }, [logs]);

  const handleMoodSelect = (mood: MoodType) => {
    setCurrentLog((prev) => ({ ...prev, mood }));
  };

  const handleEnergySelect = (energyLevel: number) => {
    setCurrentLog((prev) => ({ ...prev, energyLevel }));
  };

  const handleSleepUpdate = (sleepData: SleepData) => {
    setCurrentLog((prev) => ({ ...prev, sleep: sleepData }));
  };

  const handleSaveLog = () => {
    if (currentLog.mood && currentLog.energyLevel) {
      const newLog: WellnessLog = {
        id: Date.now().toString(),
        date: currentLog.date,
        mood: currentLog.mood,
        energyLevel: currentLog.energyLevel,
        sleep: currentLog.sleep,
        notes: currentLog.notes,
        stressLevel: currentLog.stressLevel
      };
      setLogs((prev) => [...prev, newLog]);
      setCurrentLog({ date: new Date().toISOString() });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <Header />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm">
            <MoodTracker
              onMoodSelect={handleMoodSelect}
              onEnergySelect={handleEnergySelect}
              selectedMood={currentLog.mood}
              energyLevel={currentLog.energyLevel}
            />
            
            <SleepTracker
              onSleepUpdate={handleSleepUpdate}
              sleepData={currentLog.sleep}
            />

            <button
              onClick={handleSaveLog}
              disabled={!currentLog.mood || !currentLog.energyLevel}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Save Wellness Log
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <WellnessInsights logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;