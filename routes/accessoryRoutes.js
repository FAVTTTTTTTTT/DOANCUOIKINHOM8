const express = require('express');
const router = express.Router();

const accessoryProducts = [
    {
        id: 1,
        name: 'Chuột không dây',
        price: 'Giá liên hệ',
        image: '/images/chuotkhongday.png',
        description: 'Chuột không dây tiện lợi, kết nối nhanh chóng.'
    },
    {
        id: 2,
        name: 'Loa Bluetooth',
        price: 'Giá liên hệ',
        image: '/images/loabluetoot.png',
        description: 'Loa Bluetooth di động, âm thanh sống động.'
    },
    {
        id: 3,
        name: 'Sạc dự phòng',
        price: 'Giá liên hệ',
        image: '/images/sacduphong.png',
        description: 'Sạc dự phòng dung lượng lớn, sạc nhanh.'
    },
    {
        id: 4,
        name: 'Tai nghe Bluetooth',
        price: 'Giá liên hệ',
        image: '/images/tainghebluetoot.png',
        description: 'Tai nghe Bluetooth không dây, âm thanh chất lượng.'
    },
    {
        id: 5,
        name: 'Camera',
        price: 'Giá liên hệ',
        image: '/images/camera.png',
        description: 'Camera chất lượng cao, hình ảnh sắc nét.'
    },
    {
        id: 6,
        name: 'Sạc dự phòng',
        price: 'Giá liên hệ',
        image: '/images/sacduphong.png',
        description: 'Sạc dự phòng dung lượng lớn, sạc nhanh.'
    }
];

router.get('/', (req, res) => {
    res.render('accessory', { products: accessoryProducts, session: req.session });
});

router.get('/product-detail/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = accessoryProducts.find(p => p.id === productId);
    if (product) {
        res.render('product-detail', { product: product, session: req.session });
    } else {
        res.send('Không tìm thấy sản phẩm');
    }
});

module.exports = router;