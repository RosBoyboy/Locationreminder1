export interface Category {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  radius: number;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  category_id: string | null;
  location_id: string | null;
  title: string;
  description: string | null;
  status: 'Pending' | 'Active' | 'Done' | 'Archived';
  due_date: string | null;
  is_done: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // Relations mapped via joins
  category?: Category | null;
  location?: Location | null;
}

// Omit system-generated fields for inserting/updating
export type InsertReminder = Omit<Reminder, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'category' | 'location'>;
export type UpdateReminder = Partial<InsertReminder>;


