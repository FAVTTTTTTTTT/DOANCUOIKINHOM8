const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const phoneRoutes = require('./routes/phoneRoutes');
const laptopRoutes = require('./routes/laptopRoutes');
const tabletRoutes = require('./routes/tabletRoutes');
const accessoryRoutes = require('./routes/accessoryRoutes'); // Import accessory routes
const cartRoutes = require("./routes/cartRoutes");
const profileRoutes = require("./routes/profileRoutes");
const Product = require('./models/product'); // Import Product model
const orderRoutes = require("./routes/orderRoutes");
const Order = require("./models/order");
const chiaseRoutes = require('./routes/chiaseRoutes');
const app = express();
const User = require('./models/User');


// Kết nối MongoDB
mongoose.connect('mongodb+srv://admin:123@cluster0.fyicr.mongodb.net/express', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch(err => {
    console.error('❌ Database connection error:', err);
});

// Cấu hình view engine EJS
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));

// Routes
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/about', aboutRoutes);
app.use('/phones', phoneRoutes);
app.use('/laptops', laptopRoutes);
app.use('/tablets', tabletRoutes);
app.use('/accessories', accessoryRoutes); // Use accessory routes
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes); 
app.use('/chiase', chiaseRoutes);
app.use("/profile", profileRoutes);

// Route mặc định (hiển thị trang sản phẩm chung)
app.get('/', (req, res) => {
    res.render('product', { session: req.session });
});

app.get('/product', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch products from the database
        res.render('products', { products, session: req.session });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Server error');
    }
});

// Xử lý đăng xuất
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Khởi chạy server
const port = process.env.PORT || 3004;
app.listen(port, () => {
    console.log(` Server is running on port ${port}`);
});
