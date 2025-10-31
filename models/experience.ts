import mongoose, { Schema, InferSchemaType, HydratedDocument } from "mongoose";

const experienceSchema: Schema = new Schema(
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

// Infer the base type from the schema
type ExperienceSchemaType = InferSchemaType<typeof experienceSchema>;
// This is the new, correct type for the Mongoose Document, replaces manual "IExperience extends Document" interface
export type IExperience = HydratedDocument<ExperienceSchemaType>;

export const Experience = mongoose.model<IExperience>("Experience", experienceSchema);
