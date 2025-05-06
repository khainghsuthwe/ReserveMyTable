export interface Restaurant {
  id: string;
  name: string;
  location: string;
  hours: string;
  image: string;
  diningPhotos: string[];
  tableTypes: { type: string; description: string }[];
  menu: { name: string; description: string; price: number; image: string }[];
}

export interface TableAvailability {
  id: string;
  date: string;
  time: string;
  available: number;
  reserved: number;
  image: string;
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