import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import Product from './models/productModel.js';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});
app.post('/api/products', async (req, res) => {
  try {
    const { name, image, category, description, price, countInStock } = req.body;
    const product = new Product({
      name,
      image,
      category,
      description,
      price,
      countInStock
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error) {
    res.status(400).json({ message: "Failed to add product. Check your data." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));