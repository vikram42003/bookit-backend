import express from "express";

const promoCodeRouter = express();

// POST - /api/promo/validate - validate a promo code
promoCodeRouter.post("promo/validate", (req, res) => {});

export default promoCodeRouter;
