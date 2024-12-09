// User related types
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
  }
  
  export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    priority: 'low' | 'medium' | 'high';
    userId: string;
  }
  
  
  
  // Props for components
  export interface CalendarViewProps {
    selectedDate: string;
    onSelectDate: (date: string) => void;
    events: Event[];
  }
  
  export interface EventListProps {
    events: Event[];
    onUpdateEvent: (event: Omit<Event, 'id'>) => void;
  }
  
  export interface EventCardProps {
    event: Event;
    onUpdate: (event: Omit<Event, 'id'>) => void;
  }
  
  export interface AddEventButtonProps {
    onAddEvent: (event: Omit<Event, 'id'>) => void;
    selectedDate: string;
  }
  
  // State types
  export interface AppState {
    currentUser: User | null;
    events: Event[];
    selectedDate: string;
  }
  
  // Action types for state management (if using Redux or similar)
  export type AppAction =
    | { type: 'SET_CURRENT_USER'; payload: User | null }
    | { type: 'SET_EVENTS'; payload: Event[] }
    | { type: 'ADD_EVENT'; payload: Event }
    | { type: 'UPDATE_EVENT'; payload: Event }
    | { type: 'DELETE_EVENT'; payload: string }
    | { type: 'SET_SELECTED_DATE'; payload: string };
  
  