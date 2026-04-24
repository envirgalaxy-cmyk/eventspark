export interface Event {
  id: bigint;
  title: string;
  description: string;
  category: string;
  date: bigint;
  location: string;
  city: string;
  venue: string;
  price: number;
  imageUrl: string;
  capacity: bigint;
  availableSeats: bigint;
  rating: number;
  reviewCount: bigint;
}

export interface TicketTier {
  id: bigint;
  eventId: bigint;
  name: string;
  price: number;
  benefits: string[];
  available: bigint;
  total: bigint;
}

export interface Review {
  id: bigint;
  eventId: bigint;
  authorName: string;
  rating: bigint;
  comment: string;
  date: bigint;
}

export interface Booking {
  id: string;
  eventId: bigint;
  tierId: bigint;
  quantity: bigint;
  totalPrice: number;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  confirmationCode: string;
  createdAt: bigint;
}

export interface BookingFormData {
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  tierId: bigint;
  quantity: number;
}
