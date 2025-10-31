import { CreateExperienceType, CreateTimeSlotType, PromoCodeType } from "./types/types";
import { connectDB, closeDB } from "./config/mongodb";

import { Experience } from "./models/experience";
import { TimeSlot } from "./models/timeslot";
import { Booking } from "./models/booking";
import { PromoCode } from "./models/promoCode";

// For generating random number of bookings/capacity
const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const seedDatabase = async () => {
  try {
    console.log("Seeding database...");

    console.log("Deleting old data...");
    await TimeSlot.deleteMany({});
    await Experience.deleteMany({});
    await Booking.deleteMany({});
    await PromoCode.deleteMany({});

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

    console.log("Inserting time slots...");
    await TimeSlot.insertMany(allTimeSlots);

    console.log("Inserting promo codes...");
    await PromoCode.insertMany(promoCodes);

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

const promoCodes: PromoCodeType[] = [
  {
    code: "SAVE10",
    type: "percentage",
    value: 10,
  },
  {
    code: "FLAT100",
    type: "flat",
    value: 100,
  },
  {
    code: "WINTER20",
    type: "percentage",
    value: 20,
  },
];

const seedData: CreateExperienceType[] = [
  {
    name: "Kayaking",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: [
      "https://blogger.googleusercontent.com/img/a/AVvXsEhnwMuSce7z9L4CkvWhjAUuZ6eZcIA83L7kMNI4FiN_wVkv_MT2kRuo4oPtNu4CeAli3hTSjvjrboakP59PL-XeNmEeqTrRAL1HolgFc4OvlA5yZPkgdZZE2s8T5ktblxWbUT5jxdS9oPLAc5xr6pUylASs6HlV1M9-PCctC5gJnxxjTJDa0no=w400-h300",
    ],
    price: 999,
    location: "Udupi",
    about: "Scenic routes, trained guides, and safety briefing. Minimum age 10.",
  },
  {
    name: "Nandi Hills Sunrise",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://www.zingbus.com/blog/wp-content/uploads/2025/07/Image-3-1-edited.jpg"],
    price: 899,
    location: "Bangalore",
    about: "Experience the stunning sunrise from the famous Nandi Hills. A perfect getaway.",
  },
  {
    name: "Coffee Trail",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://tuskertrailcoorg.com/wp-content/uploads/2022/04/DJI_0079.jpg"],
    price: 1299,
    location: "Coorg",
    about: "Walk through lush, misty coffee plantations in Coorg. Learn about the coffee-making process.",
  },
  {
    name: "Kayaking",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: [
      "https://th-i.thgim.com/public/news/national/karnataka/opvcc5/article38023648.ece/alternates/LANDSCAPE_1200/kayaking",
    ],
    price: 999,
    location: "Udupi, Karnataka",
    about: "Scenic routes, trained guides, and safety briefing. Minimum age 10.",
  },
  {
    name: "Nandi Hills Sunrise",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmoe97UkPmvo6YcZ1-Ib__40Ml-e4Z5MnoTw&s"],
    price: 899,
    location: "Bangalore",
    about: "Experience the stunning sunrise from the famous Nandi Hills. A perfect getaway.",
  },
  {
    name: "Boat Cruise",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpWpbfsVbtbDKWwG03H03mvLZr0FAfxPStpg&s"],
    price: 999,
    location: "Sunderban",
    about: "Explore the dense mangroves and wildlife of the Sunderbans on this guided boat tour.",
  },
  {
    name: "Bungee Jumping",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: [
      "https://imgcld.yatra.com/ytimages/image/upload/v1517480802/AdvNation/ANN_ACT45/ann_top_Bungee_Jumping_8wkReb.jpg",
    ],
    price: 999,
    location: "Manali",
    about: "Feel the adrenaline rush with a safe and thrilling bungee jump in the mountains of Manali.",
  },
  {
    name: "Coffee Trail",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    images: [
      "https://www.keralatourism.org/images/service-providers/photos/property-3499-Exterior-10665-20180829063812.jpg",
    ],
    price: 1299,
    location: "Coorg",
    about: "Walk through lush, misty coffee plantations in Coorg. Learn about the coffee-making process.",
  },
];
