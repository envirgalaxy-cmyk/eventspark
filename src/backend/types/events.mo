module {
  public type Event = {
    id : Nat;
    title : Text;
    description : Text;
    category : Text;
    date : Int;
    location : Text;
    city : Text;
    venue : Text;
    price : Float;
    imageUrl : Text;
    capacity : Nat;
    var availableSeats : Nat;
    var rating : Float;
    var reviewCount : Nat;
  };

  public type TicketTier = {
    id : Nat;
    eventId : Nat;
    name : Text;
    price : Float;
    benefits : [Text];
    var available : Nat;
    total : Nat;
  };

  public type Review = {
    id : Nat;
    eventId : Nat;
    authorName : Text;
    rating : Nat;
    comment : Text;
    date : Int;
  };

  public type Booking = {
    id : Text;
    eventId : Nat;
    tierId : Nat;
    quantity : Nat;
    totalPrice : Float;
    attendeeName : Text;
    attendeeEmail : Text;
    attendeePhone : Text;
    confirmationCode : Text;
    createdAt : Int;
  };

  // Shared (non-mutable) versions for API boundaries
  public type EventPublic = {
    id : Nat;
    title : Text;
    description : Text;
    category : Text;
    date : Int;
    location : Text;
    city : Text;
    venue : Text;
    price : Float;
    imageUrl : Text;
    capacity : Nat;
    availableSeats : Nat;
    rating : Float;
    reviewCount : Nat;
  };

  public type TicketTierPublic = {
    id : Nat;
    eventId : Nat;
    name : Text;
    price : Float;
    benefits : [Text];
    available : Nat;
    total : Nat;
  };
};
