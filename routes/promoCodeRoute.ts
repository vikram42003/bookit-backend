import express from "express";
import { PromoCode, IPromoCode } from "../models/promoCode";

const promoCodeRouter = express();

// POST - /api/promo/validate - validate a promo code
promoCodeRouter.post("/validate", async (req, res) => {
  try {
    if (!req.body.code) {
      return res.status(400).json({ error: "Bad request", message: "Promo code is required" });
    }

    const promoCode: IPromoCode | null = await PromoCode.findOne({ code: req.body.code });

    if (!promoCode) {
      return res.status(200).json({ valid: false, message: "Invalid promo code" });
    } else {
      return res.status(200).json({ valid: true, promoCode });
    }
  } catch (e) {
    throw new Error("Server error while validating promo code");
  }
});

export default promoCodeRouter;
