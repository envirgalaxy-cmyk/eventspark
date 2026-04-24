import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    id: string;
    eventId: bigint;
    confirmationCode: string;
    tierId: bigint;
    attendeeName: string;
    attendeeEmail: string;
    createdAt: bigint;
    attendeePhone: string;
    quantity: bigint;
    totalPrice: number;
}
export interface TicketTierPublic {
    id: bigint;
    eventId: bigint;
    total: bigint;
    name: string;
    available: bigint;
    benefits: Array<string>;
    price: number;
}
export type Result = {
    __kind__: "ok";
    ok: Booking;
} | {
    __kind__: "err";
    err: string;
};
export interface EventPublic {
    id: bigint;
    title: string;
    venue: string;
    city: string;
    date: bigint;
    description: string;
    imageUrl: string;
    availableSeats: bigint;
    category: string;
    rating: number;
    capacity: bigint;
    price: number;
    reviewCount: bigint;
    location: string;
}
export interface Review {
    id: bigint;
    eventId: bigint;
    date: bigint;
    authorName: string;
    comment: string;
    rating: bigint;
}
export interface backendInterface {
    addReview(eventId: bigint, authorName: string, rating: bigint, comment: string): Promise<Review>;
    createBooking(eventId: bigint, tierId: bigint, quantity: bigint, attendeeName: string, attendeeEmail: string, attendeePhone: string): Promise<Result>;
    getEvent(id: bigint): Promise<EventPublic | null>;
    getEvents(): Promise<Array<EventPublic>>;
    getEventsByCategory(category: string): Promise<Array<EventPublic>>;
    getReviews(eventId: bigint): Promise<Array<Review>>;
    getTicketTiers(eventId: bigint): Promise<Array<TicketTierPublic>>;
}
