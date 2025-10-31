// ExperienceType is used for when we already have fetched from db and fields like id have been added
export type ExperienceType = {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  location: string;
  about?: string;
  createdAt: string;
  updatedAt: string;
};

// CreateExperienceType is for when we are creating the experience to add to db
export type CreateExperienceType = Omit<ExperienceType, "id" | "createdAt" | "updatedAt">;

export type TimeSlotType = {
  id: string;
  dateTime: string;
  capacity: number;
  bookedCount: number;
  createdAt: string;
  updatedAt: string;
  // Note: 'experience' is intentionally removed by our toJSON transform
};

// CreateTimeSlotType is for creating a new time slot
// We define this manually since 'experience' is an ID
export type CreateTimeSlotType = {
  experience: string;
  dateTime: Date | string;
  capacity: number;
  bookedCount?: number;
};

export type BookingType = {
  id: string;
  timeSlot: string;
  experience: string;
  userName: string;
  userEmail: string;
  quantity: number;
  promoCode?: string;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingType = Omit<BookingType, "id" | "createdAt" | "updatedAt">;

export type PromoCodeType = {
  code: string;
  type: "flat" | "percentage";
  value: number;
}