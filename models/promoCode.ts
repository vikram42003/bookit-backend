import mongoose, { Schema, InferSchemaType, HydratedDocument } from "mongoose";

const promoCodeSchema: Schema = new Schema(
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

type promoCodeSchamType = InferSchemaType<typeof promoCodeSchema>;

export type IPromoCode = HydratedDocument<promoCodeSchamType>;

export const PromoCode = mongoose.model<IPromoCode>("PromoCodes", promoCodeSchema);
