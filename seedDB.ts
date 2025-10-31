import { CreateExperienceType, CreateTimeSlotType } from "./types/types";
import { connectDB, closeDB } from "./config/mongodb";
import { Experience } from "./models/experience";
import { TimeSlot } from "./models/timeslot";
import { Booking } from "./models/booking";

// For generating random number of bookings/capacity
const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const seedData: CreateExperienceType[] = [
  {
    name: "Kayaking",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://images.unsplash.com/photo-1594420310235-e66b7f7422f3"],
    price: 999,
    location: "Udupi",
    about: "Scenic routes, trained guides, and safety briefing. Minimum age 10.",
  },
  {
    name: "Nandi Hills Sunrise",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://upload.wikimedia.org/wikipedia/commons/5/53/Nandi_Hills_Sunrise_View.jpg"],
    price: 899,
    location: "Bangalore",
    about: "Experience the stunning sunrise from the famous Nandi Hills. A perfect getaway.",
  },
  {
    name: "Coffee Trail",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://images.unsplash.com/photo-1506362802963-f43b4f5d3865"],
    price: 1299,
    location: "Coorg",
    about: "Walk through lush, misty coffee plantations in Coorg. Learn about the coffee-making process.",
  },
  {
    name: "Kayaking",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://images.unsplash.com/photo-1560756700-0604b16e511c"],
    price: 999,
    location: "Udupi, Karnataka",
    about: "Scenic routes, trained guides, and safety briefing. Minimum age 10.",
  },
  {
    name: "Nandi Hills Sunrise",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://images.unsplash.com/photo-1542273917-03f0f062e143"],
    price: 899,
    location: "Bangalore",
    about: "Experience the stunning sunrise from the famous Nandi Hills. A perfect getaway.",
  },
  {
    name: "Boat Cruise",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://images.unsplash.com/photo-1601633916021-3310f8fb37c7"],
    price: 999,
    location: "Sunderban",
    about: "Explore the dense mangroves and wildlife of the Sunderbans on this guided boat tour.",
  },
  {
    name: "Bungee Jumping",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://images.unsplash.com/photo-1604921256333-d7d3d75079f5"],
    price: 999,
    location: "Manali",
    about: "Feel the adrenaline rush with a safe and thrilling bungee jump in the mountains of Manali.",
  },
  {
    name: "Coffee Trail",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://images.unsplash.com/photo-1447752875215-b2761acb3c5d"],
    price: 1299,
    location: "Coorg",
    about: "Walk through lush, misty coffee plantations in Coorg. Learn about the coffee-making process.",
  },
];

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");

    console.log("Deleting old data...");
    await TimeSlot.deleteMany({});
    await Experience.deleteMany({});
    await Booking.deleteMany({});

    console.log("Inserting experiences...");
    const createdExperiences = await Experience.insertMany(seedData);
    console.log(`Inserted ${createdExperiences.length} experiences.`);

    // Define the dynamic time slot generation
    const allTimeSlots: CreateTimeSlotType[] = [];

    const days = ["2025-11-01", "2025-11-02", "2025-11-03"];
    const times = ["T09:00:00.000+05:30", "T11:00:00.000+05:30", "T13:00:00.000+05:30", "T15:00:00.000+05:30"];

    // Loop through every created experience
    for (const exp of createdExperiences) {
      for (const day of days) {
        for (const time of times) {
          // Create random capacity (1-10) and bookedCount
          const newCapacity = getRandom(1, 10);
          const newBookedCount = getRandom(0, newCapacity); // Booked <= Capacity

          allTimeSlots.push({
            experience: exp.id as string,
            dateTime: `${day}${time}`,
            capacity: newCapacity,
            bookedCount: newBookedCount,
          });
        }
      }
    }

    console.log(`Inserting time slots...`);
    await TimeSlot.insertMany(allTimeSlots);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    closeDB();
  }
};

connectDB().then(() => {
  seedDatabase();
});
