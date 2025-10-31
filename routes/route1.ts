import express from "express";
import CartItem from "../models/Cart";
import Product from "../models/Product";

const cartRouter = express.Router();

// GET /api/cart - Get all cart items with total
cartRouter.get("/", async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: "mock_user" }).populate("productId");

    const total = cartItems.reduce((sum, item) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    res.json({
      items: cartItems,
      total: total.toFixed(2),
      itemCount: cartItems.length,
    });
  } catch (e) {
    const error = new Error("Server error while fetching cart items");
    error.status = 500;
    error.error = e;

    throw error;
  }
});

// POST /api/cart - { productID, quantity } - Add item to cart with the specified productID and quantity, both required
cartRouter.post("/", async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if item already in cart
    const existingItem = await CartItem.findOne({
      productId,
      userId: "mock_user",
    });

    if (existingItem) {
      const newQuantity = quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} available. You already have ${existingItem.quantity} in cart.`,
        });
      }

      existingItem.quantity = newQuantity;
      await existingItem.save();
      await existingItem.populate("productId");

      return res.json({
        message: "Cart updated",
        cartItem: existingItem,
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} available in stock`,
      });
    }

    const cartItem = new CartItem({
      productId,
      quantity,
      userId: "mock_user",
    });

    await cartItem.save();
    await cartItem.populate("productId");

    res.status(201).json({
      message: "Added to cart",
      cartItem,
    });
  } catch (e) {
    const error = new Error("Server error while adding item to cart");
    error.status = 500;
    error.error = e;

    throw error;
  }
});

// DELETE /api/cart/:id - Remove item from cart
cartRouter.delete("/:id", async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);

    res.json({
      message: "Item removed from cart",
      removedItemId: req.params.id,
    });
  } catch (e) {
    const error = new Error("Server error while deleting items from cart");
    error.status = 500;
    error.error = e;

    throw error;
  }
});

module.exports = cartRouter;
