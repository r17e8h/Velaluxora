import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import Product from './models/productModel.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

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
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));