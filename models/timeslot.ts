import mongoose, { Schema, Document } from "mongoose";

export interface ITimeSlot extends Document {
  experience: Schema.Types.ObjectId;
  dateTime: Date;
  capacity: number;
  bookedCount: number;
}

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
      // validate: {
      //   // Ensures you can't overbook
      //   validator: function (this: ITimeSlot, value: number) {
      //     return value <= this.capacity;
      //   },
      //   message: "Booked count cannot exceed capacity",
      // },
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

// Add an index for performance
// My idea of timeslot model offers atomicity and protection against double booking but may make things slow, that is why we index it
// We basically tell mongodb that sort the timeslot schema by experience, and then by dateTime, so when we search, the stuff we need is grouped together
timeSlotSchema.index({ experience: 1, dateTime: 1 });

export const TimeSlot = mongoose.model<ITimeSlot>("TimeSlot", timeSlotSchema);
