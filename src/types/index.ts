export interface Restaurant {
  id: string;
  name: string;
  location: string;
  hours: string;
  phone: string;
  cuisine: string;
  image: string;
  diningPhotos: string[];
  tableTypes: {
    type: string;
    description: string;
  }[];
  menu: {
    name: string;
    description: string;
    price: number;
    image: string;
  }[];
  reviewCount?: number; // Added in page.tsx for popularRestaurants
}

// export interface TableAvailability {
//   id: string;
//   date: string;
//   time: string;
//   restaurantId: string;
//   available: number;
//   reserved: number;
//   image: string;
// }

export interface TableAvailability {
  id: string; // Unique ID for the availability record (e.g., "avail_1")
  restaurantId: string; // Links to Restaurant.id
  date: string; // e.g., "2025-05-07"
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string; // Unique ID for the time slot (e.g., "slot_1")
  time: string; // e.g., "17:00"
  availableTables: number; // Total available tables
  reservedTables: number; // Total reserved tables
  tableTypes: TableType[]; // Breakdown by table type
}

export interface TableType {
  type: string; // e.g., "2-person"
  available: number; // Number of tables available for this type
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'owner';
}

export interface Cuisine {
  id: string;
  name: string;
  image: string;
}