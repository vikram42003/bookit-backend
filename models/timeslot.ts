import mongoose, { Schema, InferSchemaType, HydratedDocument } from "mongoose";

const timeSlotSchema: Schema = new Schema(
  {
    experience: {
      type: Schema.Types.ObjectId,
      ref: "Experience", // Refer to the Experience model
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    bookedCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret: Record<string, unknown>) => {
        // Remove the redundant experience field from the final JSON
        delete ret.experience; 
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Add an index for performance
// My idea of timeslot model offers atomicity and protection against double booking but may make things slow, that is why we index it
// We basically tell mongodb that sort the timeslot schema by experience, and then by dateTime, so when we search, the stuff we need is grouped together
// Here 1 means ascending, -1 for descending
timeSlotSchema.index({ experience: 1, dateTime: 1 });

// Infer the base type from the schema
type TimeSlotSchemaType = InferSchemaType<typeof timeSlotSchema>;

// Create the Mongoose Document type
export type ITimeSlot = HydratedDocument<TimeSlotSchemaType>;

// Create the Mongoose Model
export const TimeSlot = mongoose.model<ITimeSlot>("TimeSlot", timeSlotSchema);