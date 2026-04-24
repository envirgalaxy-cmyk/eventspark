import List "mo:core/List";
import Types "types/events";
import EventsLib "lib/events";
import EventsApi "mixins/events-api";

actor {
  let events = List.empty<Types.Event>();
  let tiers = List.empty<Types.TicketTier>();
  let reviews = List.empty<Types.Review>();
  let bookings = List.empty<Types.Booking>();

  // Seed sample data on first start (enhanced orthogonal persistence ensures
  // this runs once — state is retained across upgrades without re-seeding).
  EventsLib.seedEvents(events, tiers, reviews);

  include EventsApi(events, tiers, reviews, bookings);
};
