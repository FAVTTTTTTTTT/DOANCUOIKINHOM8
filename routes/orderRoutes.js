const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// Hiển thị danh sách đơn hàng của người dùng
router.get("/", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }
        const orders = await Order.find({ customerPhone: req.session.user.phone });
        res.render("orders", { orders, session: req.session });
    } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng:", error.message);
        console.error(error.stack);
        res.status(500).send("Lỗi server");
    }
});

// Hiển thị chi tiết đơn hàng
router.get("/:orderId", async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send("Đơn hàng không tồn tại");
        }
        res.render("order-detail", { order, session: req.session });
    } catch (error) {
        console.error("Lỗi lấy chi tiết đơn hàng:", error.message);
        console.error(error.stack);
        res.status(500).send("Lỗi server");
    }
});

module.exports = router;