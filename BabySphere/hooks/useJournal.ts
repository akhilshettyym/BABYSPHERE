import { useState, useCallback } from 'react';
import { journalService } from '../components/journalService';

export function useJournal() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveEntry = useCallback(async (content: string, tags: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      await journalService.saveEntry(content, tags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save journal entry');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    saveEntry,
  };
}