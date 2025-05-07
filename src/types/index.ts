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

export interface TableAvailability {
  id: string;
  date: string;
  time: string;
  restaurantId: string;
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

export interface Cuisine {
  id: string;
  name: string;
  image: string;
}