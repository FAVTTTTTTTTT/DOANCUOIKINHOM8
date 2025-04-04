const express = require('express');
const mongoose = require('mongoose');
const Product = require('../models/product');
const router = express.Router();

// Middleware kiểm tra ID hợp lệ
const isValidObjectId = (req, res, next) => {
  console.log("Product ID:", req.params.id); // Debug log
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  next();
};

// 📌 Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
  const query = req.query.query || ''; // Get the search query from the URL
  try {
    const products = await Product.find({ name: { $regex: query, $options: 'i' } }); // Case-insensitive search
    res.render('products', { products, query, session: req.session });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).send('Server Error');
  }
});

// 📌 Thêm sản phẩm mới
router.post('/', async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newProduct = new Product({ name, price, description, image });
    const savedProduct = await newProduct.save();
    res.redirect('/products');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📌 Lấy chi tiết sản phẩm theo ID
router.get('/:id', isValidObjectId, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.render('product-detail', { product, session: req.session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Render the edit product form
router.get('/edit/:id', isValidObjectId, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.render('edit-product', { product, session: req.session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Handle the form submission to update the product
router.post('/edit/:id', isValidObjectId, async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const updatedData = {};

    if (name) updatedData.name = name;
    if (price) updatedData.price = price;
    if (description) updatedData.description = description;
    if (image) updatedData.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.redirect('/products');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 📌 Xóa sản phẩm theo ID
router.post('/delete/:id', isValidObjectId, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.redirect('/products');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Tìm kiếm sản phẩm
router.get('/search', async (req, res) => {
  const query = req.query.query || ''; // Get the search query from the URL
  try {
    const products = await Product.find({ name: { $regex: query, $options: 'i' } }); // Case-insensitive search
    res.render('products', { products, query, session: req.session });
  } catch (err) {
    console.error("❌ Error searching products:", err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;