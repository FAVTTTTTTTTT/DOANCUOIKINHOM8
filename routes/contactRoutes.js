const express = require('express');
const nodemailer = require('nodemailer');
const Contact = require('../models/contact'); // Import model Contact
const router = express.Router();

// 📌 Hiển thị form liên hệ
router.get('/', (req, res) => {
    res.render('contact', { 
        message: null, 
        session: req.session 
    });
});


// 📌 Xử lý form liên hệ
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Kiểm tra thông tin nhập vào
        if (!name || !email || !phone || !message) {
            return res.status(400).send('Vui lòng nhập đầy đủ thông tin!');
        }

        if (!/^\d{10,11}$/.test(phone)) {
            return res.status(400).send('Số điện thoại không hợp lệ!');
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).send('Email không hợp lệ!');
        }

        // 📌 Lưu vào database
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save();

        // 📌 Gửi email cho admin
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nguyenquocduy574@gmail.com', // Thay bằng email của bạn
                pass: 'zoxj slst ddsc ofnq' // Mật khẩu ứng dụng (lưu ý bảo mật)
            }
        });

        const mailOptions = {
            from: 'nguyenquocduy574@gmail.com', // Email của bạn
            to: 'nguyenquocduy574@gmail.com', // Admin nhận mail
            replyTo: email, // Khi bấm "Trả lời", email sẽ gửi đến người nhập vào form
            subject: `Liên hệ từ ${name}`,
            text: `Họ tên: ${name}\nEmail: ${email}\nSĐT: ${phone}\nNội dung: ${message}`
        };

        await transporter.sendMail(mailOptions);

        res.send('Gửi liên hệ thành công! Cảm ơn bạn đã liên hệ.');
    } catch (error) {
        console.error('Lỗi khi xử lý liên hệ:', error);
        res.status(500).send('Lỗi khi gửi email hoặc lưu dữ liệu. Vui lòng thử lại sau!');
    }
});

module.exports = router;
