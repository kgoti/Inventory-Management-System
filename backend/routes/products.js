const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

// GET all products (with optional search)
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';

    const filter = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    const products = await Product
      .find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product
      .findById(req.params.id)
      .populate('category', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const { name, description, category, price, stock, lowStockLimit } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    const product = new Product({
      name,
      description,
      category:      category  || null,
      price:         price     || 0,
      stock:         stock     || 0,
      lowStockLimit: lowStockLimit || 5,
    });

    await product.save();
    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const { name, description, category, price, stock, lowStockLimit } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, category, price, stock, lowStockLimit },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;