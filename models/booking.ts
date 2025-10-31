import mongoose, { Schema, InferSchemaType, HydratedDocument } from "mongoose";

const bookingSchema: Schema = new Schema(
  {
    timeSlot: {
      type: Schema.Types.ObjectId,
      ref: "TimeSlot", // Links to the specific time slot
      required: true,
    },
    experience: {
      // Bring experiences to top level for easier queries (so that we can handle stuff like "show all bookings for this user")
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
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

type BookingSchemaType = InferSchemaType<typeof bookingSchema>;

export type IBooking = HydratedDocument<BookingSchemaType>;

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
