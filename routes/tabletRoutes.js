const express = require('express');
const router = express.Router();

const tabletProducts = [
    {
        id: 1,
        name: 'iPad Air',
        price: 'Giá liên hệ',
        image: '/images/ipadair.png',
        description: 'iPad Air với thiết kế mỏng nhẹ và hiệu năng mạnh mẽ.'
    },
    {
        id: 2,
        name: 'iPad 10',
        price: 'Giá liên hệ',
        image: '/images/ipad10.png',
        description: 'iPad 10 với màn hình lớn và thời lượng pin dài.'
    },
    {
        id: 3,
        name: 'OPPO Pad',
        price: 'Giá liên hệ',
        image: '/images/oppopad.png',
        description: 'OPPO Pad với thiết kế đẹp và camera ấn tượng.'
    }
];

router.get('/', (req, res) => {
    res.render('tablet', { products: tabletProducts, session: req.session });
});

router.get('/product-detail/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = tabletProducts.find(p => p.id === productId);
    if (product) {
        res.render('product-detail', { product: product, session: req.session });
    } else {
        res.send('Không tìm thấy sản phẩm');
    }
});

module.exports = router;