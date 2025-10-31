import mongoose, { Schema } from "mongoose";

export interface IPromoCode {
  code: string;
  type: "percentage" | "flat";
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

const promoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["percentage", "flat"],
    },
    value: {
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

// 3. Export the model with proper typing
export const PromoCode = mongoose.model<IPromoCode>("PromoCode", promoCodeSchema);
