import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  timeSlot: Schema.Types.ObjectId;
  experience: Schema.Types.ObjectId;
  userName: string;
  userEmail: string;
  promoCode?: string;
  finalPrice: number;
}

const bookingSchema: Schema = new Schema<IBooking>(
  {
    timeSlot: {
      type: Schema.Types.ObjectId,
      ref: "TimeSlot", // Links to the specific time slot
      required: true,
    },
    experience: {
      // Denormalized for easier queries (e.g., "show all bookings for this user")
      type: Schema.Types.ObjectId,
      ref: "Experience",
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    promoCode: {
      type: String,
      trim: true,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret: Record<string, unknown>) => {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
