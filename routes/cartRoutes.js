const express = require("express");
const router = express.Router();
const Cart = require("../models/cart");
const Order = require("../models/order"); // Giả sử bạn có model Order để lưu thông tin đơn hàng
const Product = require("../models/product");

// Hiển thị giỏ hàng
router.get("/", async (req, res) => {
    try {
        const cart = req.session.cart || [];
        res.render("cart", { items: cart, session: req.session });
    } catch (error) {
        console.error("Lỗi lấy giỏ hàng:", error.message);
        console.error(error.stack);
        res.status(500).send("Lỗi server");
    }
});

// API Thêm sản phẩm vào giỏ
router.post('/add', async (req, res) => {
    const { productId, name, price, image } = req.body;

    let cart = req.session.cart || [];
    let existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ productId, name, price, image, quantity: 1 });
    }

    req.session.cart = cart; // Cập nhật giỏ hàng trong session
    res.redirect('/cart'); // Chuyển hướng đến trang giỏ hàng
});

// API Cập nhật số lượng sản phẩm trong giỏ
router.post('/update', async (req, res) => {
    const { productId, quantity } = req.body;

    let cart = req.session.cart || [];
    let existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity = parseInt(quantity, 10);
    }

    req.session.cart = cart; // Cập nhật giỏ hàng trong session
    res.redirect('/cart'); // Chuyển hướng đến trang giỏ hàng
});

// API Xóa sản phẩm khỏi giỏ
router.post('/remove', async (req, res) => {
    const { productId } = req.body;

    let cart = req.session.cart || [];
    cart = cart.filter(item => item.productId !== productId);

    req.session.cart = cart; // Cập nhật giỏ hàng trong session
    res.redirect('/cart'); // Chuyển hướng đến trang giỏ hàng
});

// API Thanh toán
router.post('/checkout', async (req, res) => {
    const { name, address, phone } = req.body;
    const cart = req.session.cart || [];

    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
        customerName: name,
        customerAddress: address,
        customerPhone: phone,
        items: cart,
        totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
        paymentMethod: 'cash',
        status: 'pending'
    });

    try {
        await newOrder.save();
        req.session.cart = []; // Xóa giỏ hàng sau khi thanh toán
        req.session.user = { ...req.session.user, phone }; // Lưu số điện thoại vào session
        res.render('checkout-success', { order: newOrder, session: req.session }); // Pass session to template
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error.message);
        console.error(error.stack);
        res.status(500).send("Lỗi server");
    }
});

// Middleware để khởi tạo giỏ hàng nếu chưa có
router.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

module.exports = router;