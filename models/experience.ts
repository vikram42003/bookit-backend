import mongoose, { Schema } from "mongoose";

export interface IExperience {
  _id: string;
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  location: string;
  about?: string;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 999,
    },
    location: {
      type: String,
      trim: true,
      required: true,
    },
    about: {
      type: String,
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

export const Experience = mongoose.model<IExperience>("Experience", experienceSchema);
