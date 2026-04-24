import List "mo:core/List";
import Types "../types/events";
import Common "../types/common";
import EventsLib "../lib/events";

mixin (
  events : List.List<Types.Event>,
  tiers : List.List<Types.TicketTier>,
  reviews : List.List<Types.Review>,
  bookings : List.List<Types.Booking>,
) {
  var nextBookingId : Nat = 0;
  var nextReviewId : Nat = 55; // start after seed reviews

  public query func getEvents() : async [Types.EventPublic] {
    EventsLib.getAll(events);
  };

  public query func getEvent(id : Nat) : async ?Types.EventPublic {
    EventsLib.getById(events, id);
  };

  public query func getEventsByCategory(category : Text) : async [Types.EventPublic] {
    EventsLib.getByCategory(events, category);
  };

  public query func getTicketTiers(eventId : Nat) : async [Types.TicketTierPublic] {
    EventsLib.getTiers(tiers, eventId);
  };

  public query func getReviews(eventId : Nat) : async [Types.Review] {
    EventsLib.getReviews(reviews, eventId);
  };

  public func createBooking(
    eventId : Nat,
    tierId : Nat,
    quantity : Nat,
    attendeeName : Text,
    attendeeEmail : Text,
    attendeePhone : Text,
  ) : async Common.Result<Types.Booking, Text> {
    nextBookingId += 1;
    EventsLib.createBooking(
      events,
      tiers,
      bookings,
      nextBookingId,
      eventId,
      tierId,
      quantity,
      attendeeName,
      attendeeEmail,
      attendeePhone,
    );
  };

  public func addReview(
    eventId : Nat,
    authorName : Text,
    rating : Nat,
    comment : Text,
  ) : async Types.Review {
    nextReviewId += 1;
    EventsLib.addReview(events, reviews, nextReviewId, eventId, authorName, rating, comment);
  };
};
