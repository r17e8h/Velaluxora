import express from 'express';
import Order from '../models/orderModel.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items in the cart' });
      return;
    } 
    const order = new Order({
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item._id, 
        _id: undefined 
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});
router.get('/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

export default router;