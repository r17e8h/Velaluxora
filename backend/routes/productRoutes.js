import express from 'express';
import Product from '../models/productModel.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all products (with search)
router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ],
        }
      : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Jewelry piece not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST a review
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE A PRODUCT (Admin Only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    
    // Find the specific piece of jewelry in the database
    const product = await Product.findById(req.params.id);

    if (product) {
      // Overwrite the old data with the new data from your form
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      // Save it back to MongoDB
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: 'Server Error updating product' });
  }
});
// CREATE A SAMPLE PRODUCT (Admin Only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product({
      name: 'New Jewelry Piece',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'VelaLuxora',
      category: 'Necklaces',
      countInStock: 0,
      numReviews: 0,
      description: 'Enter description here...',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not create product template' });
  }
});

// DELETE A PRODUCT (Admin Only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne(); // Removes it from MongoDB
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not delete product' });
  }
});

export default router;