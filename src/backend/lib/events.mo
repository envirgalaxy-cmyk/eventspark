import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/events";
import Common "../types/common";

module {

  // ── Helpers ──────────────────────────────────────────────────────────────

  func toPublicEvent(e : Types.Event) : Types.EventPublic {
    {
      id = e.id;
      title = e.title;
      description = e.description;
      category = e.category;
      date = e.date;
      location = e.location;
      city = e.city;
      venue = e.venue;
      price = e.price;
      imageUrl = e.imageUrl;
      capacity = e.capacity;
      availableSeats = e.availableSeats;
      rating = e.rating;
      reviewCount = e.reviewCount;
    };
  };

  func toPublicTier(t : Types.TicketTier) : Types.TicketTierPublic {
    {
      id = t.id;
      eventId = t.eventId;
      name = t.name;
      price = t.price;
      benefits = t.benefits;
      available = t.available;
      total = t.total;
    };
  };

  // ── Queries ───────────────────────────────────────────────────────────────

  public func getAll(events : List.List<Types.Event>) : [Types.EventPublic] {
    events.map<Types.Event, Types.EventPublic>(toPublicEvent).toArray();
  };

  public func getById(events : List.List<Types.Event>, id : Nat) : ?Types.EventPublic {
    switch (events.find(func(e) { e.id == id })) {
      case (?e) { ?toPublicEvent(e) };
      case null { null };
    };
  };

  public func getByCategory(events : List.List<Types.Event>, category : Text) : [Types.EventPublic] {
    events.filter(func(e) { e.category == category })
          .map<Types.Event, Types.EventPublic>(toPublicEvent)
          .toArray();
  };

  public func getTiers(tiers : List.List<Types.TicketTier>, eventId : Nat) : [Types.TicketTierPublic] {
    tiers.filter(func(t) { t.eventId == eventId })
         .map<Types.TicketTier, Types.TicketTierPublic>(toPublicTier)
         .toArray();
  };

  public func getReviews(reviews : List.List<Types.Review>, eventId : Nat) : [Types.Review] {
    reviews.filter(func(r) { r.eventId == eventId }).toArray();
  };

  // ── Mutations ─────────────────────────────────────────────────────────────

  public func createBooking(
    events : List.List<Types.Event>,
    tiers : List.List<Types.TicketTier>,
    bookings : List.List<Types.Booking>,
    nextBookingId : Nat,
    eventId : Nat,
    tierId : Nat,
    quantity : Nat,
    attendeeName : Text,
    attendeeEmail : Text,
    attendeePhone : Text,
  ) : Common.Result<Types.Booking, Text> {
    // Validate event exists
    let event = switch (events.find(func(e) { e.id == eventId })) {
      case (?e) { e };
      case null { return #err("Event not found") };
    };
    // Validate tier exists and belongs to event
    let tier = switch (tiers.find(func(t) { t.id == tierId and t.eventId == eventId })) {
      case (?t) { t };
      case null { return #err("Ticket tier not found") };
    };
    // Validate seat availability
    if (event.availableSeats < quantity) {
      return #err("Not enough available seats");
    };
    if (tier.available < quantity) {
      return #err("Not enough tickets in this tier");
    };
    // Deduct seats
    event.availableSeats -= quantity;
    tier.available -= quantity;
    // Build confirmation code
    let code = "BOOK-" # nextBookingId.toText() # "-" # eventId.toText();
    let booking : Types.Booking = {
      id = nextBookingId.toText();
      eventId;
      tierId;
      quantity;
      totalPrice = tier.price * quantity.toFloat();
      attendeeName;
      attendeeEmail;
      attendeePhone;
      confirmationCode = code;
      createdAt = Time.now();
    };
    bookings.add(booking);
    #ok(booking);
  };

  public func addReview(
    events : List.List<Types.Event>,
    reviews : List.List<Types.Review>,
    nextReviewId : Nat,
    eventId : Nat,
    authorName : Text,
    rating : Nat,
    comment : Text,
  ) : Types.Review {
    // Validate event exists
    let event = switch (events.find(func(e) { e.id == eventId })) {
      case (?e) { e };
      case null { Runtime.trap("Event not found") };
    };
    let review : Types.Review = {
      id = nextReviewId;
      eventId;
      authorName;
      rating;
      comment;
      date = Time.now();
    };
    reviews.add(review);
    // Update event rating average
    let currentTotal = event.rating * event.reviewCount.toFloat();
    event.reviewCount += 1;
    event.rating := (currentTotal + rating.toFloat()) / event.reviewCount.toFloat();
    review;
  };

  // ── Seed ─────────────────────────────────────────────────────────────────

  // Base timestamp: roughly 2026-04-24 in nanoseconds
  let baseTs : Int = 1745452800_000_000_000;
  // 1 day in nanoseconds
  let day : Int = 86_400_000_000_000;

  public func seedEvents(
    events : List.List<Types.Event>,
    tiers : List.List<Types.TicketTier>,
    reviews : List.List<Types.Review>,
  ) {
    // ── CONCERTS ──────────────────────────────────────────────────────────

    // 1. Rock concert
    events.add({
      id = 1;
      title = "Thunder Riot – Rock Night";
      description = "An electrifying rock concert featuring three top-chart bands tearing up the stage with hard riffs, pyrotechnics, and non-stop energy.";
      category = "concert";
      date = baseTs + 10 * day;
      location = "Madison Square Garden, New York, NY";
      city = "New York";
      venue = "Madison Square Garden";
      price = 89.0;
      imageUrl = "https://picsum.photos/seed/event1/800/450";
      capacity = 5000;
      var availableSeats = 4120;
      var rating = 4.7;
      var reviewCount = 3;
    });
    // 2. Jazz festival
    events.add({
      id = 2;
      title = "Blue Note Jazz Festival";
      description = "A sophisticated evening celebrating the finest in contemporary and classic jazz, featuring Grammy-winning artists in an intimate setting.";
      category = "concert";
      date = baseTs + 15 * day;
      location = "Village Vanguard, New York, NY";
      city = "New York";
      venue = "Village Vanguard";
      price = 65.0;
      imageUrl = "https://picsum.photos/seed/event2/800/450";
      capacity = 500;
      var availableSeats = 340;
      var rating = 4.9;
      var reviewCount = 4;
    });
    // 3. Pop concert
    events.add({
      id = 3;
      title = "Neon Pop Spectacular";
      description = "Dazzling pop performances with spectacular light shows, costume changes, and surprise guest appearances that will leave you breathless.";
      category = "concert";
      date = baseTs + 22 * day;
      location = "Staples Center, Los Angeles, CA";
      city = "Los Angeles";
      venue = "Crypto.com Arena";
      price = 120.0;
      imageUrl = "https://picsum.photos/seed/event3/800/450";
      capacity = 3500;
      var availableSeats = 2800;
      var rating = 4.5;
      var reviewCount = 5;
    });
    // 4. Electronic music
    events.add({
      id = 4;
      title = "Pulse – Electronic Music Night";
      description = "An immersive underground electronic music experience with world-class DJs, laser installations, and a state-of-the-art sound system.";
      category = "concert";
      date = baseTs + 18 * day;
      location = "Exchange LA, Los Angeles, CA";
      city = "Los Angeles";
      venue = "Exchange LA";
      price = 55.0;
      imageUrl = "https://picsum.photos/seed/event4/800/450";
      capacity = 1200;
      var availableSeats = 890;
      var rating = 4.6;
      var reviewCount = 3;
    });

    // ── WORKSHOPS ─────────────────────────────────────────────────────────

    // 5. Photography
    events.add({
      id = 5;
      title = "Urban Photography Masterclass";
      description = "Learn to capture the soul of the city through the lens of a professional photographer. Covers composition, lighting, and post-processing techniques.";
      category = "workshop";
      date = baseTs + 7 * day;
      location = "SFMOMA, San Francisco, CA";
      city = "San Francisco";
      venue = "SFMOMA Studio";
      price = 149.0;
      imageUrl = "https://picsum.photos/seed/event5/800/450";
      capacity = 25;
      var availableSeats = 12;
      var rating = 4.8;
      var reviewCount = 4;
    });
    // 6. Coding
    events.add({
      id = 6;
      title = "Web3 Development Bootcamp";
      description = "Hands-on full-day workshop covering smart contracts, dApps, and blockchain fundamentals. Bring your laptop and leave with deployable code.";
      category = "workshop";
      date = baseTs + 12 * day;
      location = "WeWork SoMa, San Francisco, CA";
      city = "San Francisco";
      venue = "WeWork SoMa";
      price = 299.0;
      imageUrl = "https://picsum.photos/seed/event6/800/450";
      capacity = 40;
      var availableSeats = 18;
      var rating = 4.7;
      var reviewCount = 3;
    });
    // 7. Yoga
    events.add({
      id = 7;
      title = "Sunrise Rooftop Yoga Retreat";
      description = "A transformative sunrise yoga session on a downtown rooftop. Suitable for all levels. Includes guided meditation and a healthy breakfast spread.";
      category = "workshop";
      date = baseTs + 5 * day;
      location = "The Rooftop at theWit, Chicago, IL";
      city = "Chicago";
      venue = "theWit Rooftop";
      price = 45.0;
      imageUrl = "https://picsum.photos/seed/event7/800/450";
      capacity = 30;
      var availableSeats = 20;
      var rating = 4.9;
      var reviewCount = 5;
    });
    // 8. Cooking
    events.add({
      id = 8;
      title = "Italian Kitchen Secrets";
      description = "Cook alongside a Michelin-trained chef and master authentic pasta, risotto, and tiramisu in this hands-on culinary workshop.";
      category = "workshop";
      date = baseTs + 25 * day;
      location = "Eataly Chicago, Chicago, IL";
      city = "Chicago";
      venue = "Eataly Chicago";
      price = 175.0;
      imageUrl = "https://picsum.photos/seed/event8/800/450";
      capacity = 20;
      var availableSeats = 8;
      var rating = 4.8;
      var reviewCount = 4;
    });

    // ── CONFERENCES ───────────────────────────────────────────────────────

    // 9. Tech
    events.add({
      id = 9;
      title = "FutureTech Summit 2026";
      description = "The Bay Area's premier tech conference bringing together innovators, founders, and investors to explore AI, robotics, and the future of computing.";
      category = "conference";
      date = baseTs + 30 * day;
      location = "Moscone Center, San Francisco, CA";
      city = "San Francisco";
      venue = "Moscone Center";
      price = 499.0;
      imageUrl = "https://picsum.photos/seed/event9/800/450";
      capacity = 2000;
      var availableSeats = 1340;
      var rating = 4.6;
      var reviewCount = 5;
    });
    // 10. Business
    events.add({
      id = 10;
      title = "Startup Growth Conference";
      description = "Two days of actionable insights on scaling your business, raising capital, and building world-class teams, with 50+ top speakers.";
      category = "conference";
      date = baseTs + 35 * day;
      location = "Marriott Marquis, New York, NY";
      city = "New York";
      venue = "Marriott Marquis";
      price = 350.0;
      imageUrl = "https://picsum.photos/seed/event10/800/450";
      capacity = 800;
      var availableSeats = 530;
      var rating = 4.4;
      var reviewCount = 4;
    });
    // 11. Design
    events.add({
      id = 11;
      title = "Design Forward Conference";
      description = "A curated gathering of product designers, UX researchers, and creative directors exploring the intersection of aesthetics, usability, and human emotion.";
      category = "conference";
      date = baseTs + 42 * day;
      location = "Boston Convention Center, Boston, MA";
      city = "Boston";
      venue = "Boston Convention Center";
      price = 275.0;
      imageUrl = "https://picsum.photos/seed/event11/800/450";
      capacity = 600;
      var availableSeats = 445;
      var rating = 4.7;
      var reviewCount = 3;
    });
    // 12. Health
    events.add({
      id = 12;
      title = "Wellness & Biohacking Expo";
      description = "Discover cutting-edge longevity science, nutrition strategies, sleep optimization, and mental performance tools from the world's leading health researchers.";
      category = "conference";
      date = baseTs + 50 * day;
      location = "Hynes Convention Center, Boston, MA";
      city = "Boston";
      venue = "Hynes Convention Center";
      price = 189.0;
      imageUrl = "https://picsum.photos/seed/event12/800/450";
      capacity = 1000;
      var availableSeats = 720;
      var rating = 4.5;
      var reviewCount = 4;
    });
    // 13. Extra – Indie Folk concert
    events.add({
      id = 13;
      title = "Indie Folk Under the Stars";
      description = "An intimate outdoor concert series featuring emerging indie folk artists. Bring a blanket, sip craft cocktails, and lose yourself in soulful melodies.";
      category = "concert";
      date = baseTs + 20 * day;
      location = "Millennium Park, Chicago, IL";
      city = "Chicago";
      venue = "Millennium Park";
      price = 35.0;
      imageUrl = "https://picsum.photos/seed/event13/800/450";
      capacity = 2000;
      var availableSeats = 1600;
      var rating = 4.3;
      var reviewCount = 3;
    });
    // 14. Watercolor workshop
    events.add({
      id = 14;
      title = "Watercolor & Wine Workshop";
      description = "Unwind with guided watercolor painting and curated wines. No art experience needed — just a love for creativity and good company.";
      category = "workshop";
      date = baseTs + 8 * day;
      location = "Boston Art Studio, Boston, MA";
      city = "Boston";
      venue = "Boston Art Studio";
      price = 75.0;
      imageUrl = "https://picsum.photos/seed/event14/800/450";
      capacity = 30;
      var availableSeats = 22;
      var rating = 4.6;
      var reviewCount = 4;
    });

    // ── TICKET TIERS ──────────────────────────────────────────────────────
    // Each event gets 3 tiers. Tier IDs: (eventId-1)*3 + 1/2/3

    let eventDefs : [(Nat, Float)] = [
      (1, 89.0), (2, 65.0), (3, 120.0), (4, 55.0),
      (5, 149.0), (6, 299.0), (7, 45.0), (8, 175.0),
      (9, 499.0), (10, 350.0), (11, 275.0), (12, 189.0),
      (13, 35.0), (14, 75.0),
    ];

    var tierIdx = 0;
    for ((eid, basePrice) in eventDefs.values()) {
      let t1 : Nat = tierIdx * 3 + 1;
      let t2 : Nat = tierIdx * 3 + 2;
      let t3 : Nat = tierIdx * 3 + 3;
      tiers.add({
        id = t1;
        eventId = eid;
        name = "Early Bird";
        price = basePrice * 0.9;
        benefits = ["Early venue access (30 min)", "10% discount", "Digital programme"];
        var available = 50;
        total = 50;
      });
      tiers.add({
        id = t2;
        eventId = eid;
        name = "Standard";
        price = basePrice;
        benefits = ["General admission", "Digital programme"];
        var available = 200;
        total = 200;
      });
      tiers.add({
        id = t3;
        eventId = eid;
        name = "VIP";
        price = basePrice * 2.5;
        benefits = ["Front row / premium seating", "Backstage pass", "Exclusive merchandise", "Meet & greet", "Complimentary drinks"];
        var available = 20;
        total = 20;
      });
      tierIdx += 1;
    };

    // ── SAMPLE REVIEWS ────────────────────────────────────────────────────

    // Event 1 – Thunder Riot
    reviews.add({ id = 1; eventId = 1; authorName = "Jake M."; rating = 5; comment = "Absolutely insane show — the pyrotechnics alone were worth the ticket price!"; date = baseTs - 5 * day });
    reviews.add({ id = 2; eventId = 1; authorName = "Sara T."; rating = 5; comment = "Best rock concert I've attended in a decade. The energy was unreal."; date = baseTs - 4 * day });
    reviews.add({ id = 3; eventId = 1; authorName = "Daniel R."; rating = 4; comment = "Great set list and sound quality. Parking was a bit of a hassle."; date = baseTs - 3 * day });

    // Event 2 – Blue Note Jazz
    reviews.add({ id = 4; eventId = 2; authorName = "Elena V."; rating = 5; comment = "Pure magic. The trumpet solos brought tears to my eyes."; date = baseTs - 6 * day });
    reviews.add({ id = 5; eventId = 2; authorName = "Marcus L."; rating = 5; comment = "Intimate, classy, world-class. Will be back every year."; date = baseTs - 5 * day });
    reviews.add({ id = 6; eventId = 2; authorName = "Priya S."; rating = 5; comment = "A genuinely transcendent musical experience."; date = baseTs - 4 * day });
    reviews.add({ id = 7; eventId = 2; authorName = "Tom W."; rating = 4; comment = "Exceptional performers. Wish it ran an hour longer."; date = baseTs - 3 * day });

    // Event 3 – Neon Pop
    reviews.add({ id = 8; eventId = 3; authorName = "Chloe B."; rating = 5; comment = "The light show was out of this world! Loved every second."; date = baseTs - 7 * day });
    reviews.add({ id = 9; eventId = 3; authorName = "Ryan K."; rating = 4; comment = "Great performance but the venue was a little packed."; date = baseTs - 6 * day });
    reviews.add({ id = 10; eventId = 3; authorName = "Mia F."; rating = 5; comment = "She changed outfits 6 times. Incredible production value."; date = baseTs - 5 * day });
    reviews.add({ id = 11; eventId = 3; authorName = "Luca A."; rating = 4; comment = "Amazing songs, great stage presence. Sound cut out briefly."; date = baseTs - 4 * day });
    reviews.add({ id = 12; eventId = 3; authorName = "Sofia N."; rating = 4; comment = "Had a blast. The surprise guest was a total shock!"; date = baseTs - 3 * day });

    // Event 4 – Pulse Electronic
    reviews.add({ id = 13; eventId = 4; authorName = "DJ_Wren"; rating = 5; comment = "Peak underground vibes. The bass was physical."; date = baseTs - 4 * day });
    reviews.add({ id = 14; eventId = 4; authorName = "Nat G."; rating = 4; comment = "Great DJs, solid laser show. Could use better ventilation."; date = baseTs - 3 * day });
    reviews.add({ id = 15; eventId = 4; authorName = "Zoe P."; rating = 5; comment = "Danced all night. One of my top nights out this year."; date = baseTs - 2 * day });

    // Event 5 – Photography Workshop
    reviews.add({ id = 16; eventId = 5; authorName = "Hana L."; rating = 5; comment = "James is an incredible teacher. My street photography improved overnight."; date = baseTs - 8 * day });
    reviews.add({ id = 17; eventId = 5; authorName = "Owen T."; rating = 5; comment = "Small class size means you get real feedback. Highly recommend."; date = baseTs - 7 * day });
    reviews.add({ id = 18; eventId = 5; authorName = "Leah D."; rating = 5; comment = "Practical, inspiring, and fun. Left with a portfolio-ready shot."; date = baseTs - 6 * day });
    reviews.add({ id = 19; eventId = 5; authorName = "Felix C."; rating = 4; comment = "Great content. Wish we had more time on the Lightroom portion."; date = baseTs - 5 * day });

    // Event 6 – Web3 Bootcamp
    reviews.add({ id = 20; eventId = 6; authorName = "Aiden H."; rating = 5; comment = "Went in knowing nothing about smart contracts, left with a deployed app!"; date = baseTs - 9 * day });
    reviews.add({ id = 21; eventId = 6; authorName = "Iris Y."; rating = 4; comment = "Dense material but the instructors were patient and knowledgeable."; date = baseTs - 8 * day });
    reviews.add({ id = 22; eventId = 6; authorName = "Miles B."; rating = 5; comment = "Best technical workshop I've taken. Very hands-on."; date = baseTs - 7 * day });

    // Event 7 – Yoga Retreat
    reviews.add({ id = 23; eventId = 7; authorName = "Grace O."; rating = 5; comment = "Waking up to sunrise yoga over the skyline is pure magic."; date = baseTs - 10 * day });
    reviews.add({ id = 24; eventId = 7; authorName = "Noah S."; rating = 5; comment = "The meditation at the end was deeply peaceful. 10/10."; date = baseTs - 9 * day });
    reviews.add({ id = 25; eventId = 7; authorName = "Lily K."; rating = 5; comment = "Best way to start a Saturday. The breakfast spread was a bonus!"; date = baseTs - 8 * day });
    reviews.add({ id = 26; eventId = 7; authorName = "Sam F."; rating = 5; comment = "Calming, centering, and the instructor was world-class."; date = baseTs - 7 * day });
    reviews.add({ id = 27; eventId = 7; authorName = "Ava M."; rating = 4; comment = "Wonderful session, though it started 10 minutes late."; date = baseTs - 6 * day });

    // Event 8 – Italian Cooking
    reviews.add({ id = 28; eventId = 8; authorName = "Marco G."; rating = 5; comment = "Chef Rosa is brilliant. I finally understand how to make proper pasta dough."; date = baseTs - 11 * day });
    reviews.add({ id = 29; eventId = 8; authorName = "Nina V."; rating = 5; comment = "Delicious, educational, and such a warm atmosphere."; date = baseTs - 10 * day });
    reviews.add({ id = 30; eventId = 8; authorName = "Tom A."; rating = 5; comment = "The tiramisu recipe alone is worth the price of admission."; date = baseTs - 9 * day });
    reviews.add({ id = 31; eventId = 8; authorName = "Jess P."; rating = 4; comment = "Excellent class. A bit cramped but the food was extraordinary."; date = baseTs - 8 * day });

    // Event 9 – FutureTech Summit
    reviews.add({ id = 32; eventId = 9; authorName = "Chris L."; rating = 5; comment = "The AI keynote alone changed the way I think about the next decade."; date = baseTs - 12 * day });
    reviews.add({ id = 33; eventId = 9; authorName = "Emma K."; rating = 4; comment = "World-class speakers. The networking lunch was invaluable."; date = baseTs - 11 * day });
    reviews.add({ id = 34; eventId = 9; authorName = "Ryan D."; rating = 5; comment = "An absolute must for anyone in tech. I came back with 30 pages of notes."; date = baseTs - 10 * day });
    reviews.add({ id = 35; eventId = 9; authorName = "Julia W."; rating = 4; comment = "Great content. Some sessions ran over time."; date = baseTs - 9 * day });
    reviews.add({ id = 36; eventId = 9; authorName = "Ben S."; rating = 5; comment = "The robotics demo was mind-blowing. See you next year!"; date = baseTs - 8 * day });

    // Event 10 – Startup Growth
    reviews.add({ id = 37; eventId = 10; authorName = "Alice B."; rating = 4; comment = "Practical advice I could apply to my startup immediately."; date = baseTs - 13 * day });
    reviews.add({ id = 38; eventId = 10; authorName = "Kevin M."; rating = 5; comment = "The fundraising panel was eye-opening. Met my future co-founder here!"; date = baseTs - 12 * day });
    reviews.add({ id = 39; eventId = 10; authorName = "Diane Z."; rating = 4; comment = "Solid conference. A few panels felt too broad."; date = baseTs - 11 * day });
    reviews.add({ id = 40; eventId = 10; authorName = "Sam R."; rating = 4; comment = "Good mix of theory and real-world case studies."; date = baseTs - 10 * day });

    // Event 11 – Design Forward
    reviews.add({ id = 41; eventId = 11; authorName = "Mona L."; rating = 5; comment = "The UX research talks were exactly what my team needed."; date = baseTs - 14 * day });
    reviews.add({ id = 42; eventId = 11; authorName = "Pablo R."; rating = 5; comment = "Beautifully organised event. Felt like the conference itself was designed."; date = baseTs - 13 * day });
    reviews.add({ id = 43; eventId = 11; authorName = "Zara H."; rating = 4; comment = "Inspiring talks but I wish there were more product demos."; date = baseTs - 12 * day });

    // Event 12 – Wellness & Biohacking
    reviews.add({ id = 44; eventId = 12; authorName = "Leo M."; rating = 4; comment = "Fascinating science. Left with a whole new sleep routine."; date = baseTs - 15 * day });
    reviews.add({ id = 45; eventId = 12; authorName = "Fiona T."; rating = 5; comment = "The longevity panel was worth every penny of the ticket."; date = baseTs - 14 * day });
    reviews.add({ id = 46; eventId = 12; authorName = "Ravi P."; rating = 4; comment = "Great content, some vendors felt a bit pushy."; date = baseTs - 13 * day });
    reviews.add({ id = 47; eventId = 12; authorName = "Cara N."; rating = 5; comment = "Changed how I think about nutrition entirely."; date = baseTs - 12 * day });

    // Event 13 – Indie Folk
    reviews.add({ id = 48; eventId = 13; authorName = "Will C."; rating = 4; comment = "Beautiful outdoor venue. The headliner was hauntingly good."; date = baseTs - 5 * day });
    reviews.add({ id = 49; eventId = 13; authorName = "Phoebe J."; rating = 4; comment = "Loved the intimate vibe for an outdoor show. Star of the night!"; date = baseTs - 4 * day });
    reviews.add({ id = 50; eventId = 13; authorName = "Carlos A."; rating = 4; comment = "Chill, lovely, and the acoustics were surprisingly good."; date = baseTs - 3 * day });

    // Event 14 – Watercolor & Wine
    reviews.add({ id = 51; eventId = 14; authorName = "Beth O."; rating = 5; comment = "Such a fun evening! My painting actually looks decent."; date = baseTs - 6 * day });
    reviews.add({ id = 52; eventId = 14; authorName = "Chris W."; rating = 4; comment = "Great wine selection and the instructor was super patient."; date = baseTs - 5 * day });
    reviews.add({ id = 53; eventId = 14; authorName = "Amy G."; rating = 5; comment = "Perfect girls' night out. We're booking the next one already."; date = baseTs - 4 * day });
    reviews.add({ id = 54; eventId = 14; authorName = "James K."; rating = 4; comment = "Really relaxing and enjoyable. The wine pairings were excellent."; date = baseTs - 3 * day });
  };
};
