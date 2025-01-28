export interface JournalTag {
    id: string;
    name: string;
  }
  
  export interface JournalEntry {
    id: string;
    content: string;
    tags: string[];
    date: string;
    userId: string;
  }