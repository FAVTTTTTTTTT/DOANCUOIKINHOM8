const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const cookieParser = require('cookie-parser'); // Add this at the top
const router = express.Router();

router.use(cookieParser()); // Use cookie-parser middleware

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, password, role } = req.body; // Include role in the request body
    try {
        let user = await User.findOne({ username });
        if (user) {
            console.log(`⚠️ User already exists: ${username}`);
            return res.status(400).send('User already exists');
        }

        // Hash the password before saving
        user = new User({ username, password, role });
        await user.save();
        console.log(`🎉 New user created: ${username}`);

        res.redirect('/auth/login');  
    } catch (err) {
        console.error('🚨 Registration error:', err);
        res.status(500).send('Server error');
    }
});

router.get('/login', (req, res) => {
    const tempData = req.cookies.tempData ? JSON.parse(req.cookies.tempData) : null; // Retrieve data from cookie
    if (tempData) {
        req.session.products = tempData.products;
        req.session.profile = tempData.profile;
        res.clearCookie('tempData'); // Clear the cookie after restoring data
    }
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password,phone } = req.body;
    console.log(`🔍 Checking password for user: ${username}`);
    
    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log(`❌ User not found: ${username}`);
            return res.status(400).send('Invalid username');
        }

        console.log(`🔐 Hashed password in DB: ${user.password}`);

        const isMatch = await bcrypt.compare(password, user.password,);
        console.log(`🔍 Password match result: ${isMatch}`);

        if (!isMatch) {
            console.log(`❌ Incorrect password for: ${username}`);
            return res.status(400).send('Invalid password');
        }

        // ✅ Thêm role vào session
        req.session.user = { id: user._id, username: user.username, role: user.role };
        req.session.save(() => res.redirect('/'));

    } catch (err) {
        console.error('🚨 Server error:', err);
        res.status(500).send('Server error');
    }
});


router.get('/logout', (req, res) => {
    const tempData = { products: req.session.products, profile: req.session.profile }; // Save session data
    res.cookie('tempData', JSON.stringify(tempData), { httpOnly: true }); // Store data in a cookie

    req.session.destroy((err) => {
        if (err) {
            console.error('🚨 Error destroying session:', err);
            return res.status(500).send('Server error');
        }
        res.redirect('/auth/login'); // Redirect to login page
    });
});

module.exports = router;
