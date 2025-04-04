const express = require('express');
const router = express.Router();

const phoneProducts = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max',
    price: 'Giá liên hệ',
    image: '/images/ip16prm.png',
    description: 'iPhone 16 Pro Max mới nhất với nhiều cải tiến.'
  },
  {
    id: 2,
    name: 'iPhone 16 E',
    price: 'Giá liên hệ',
    image: '/images/ip16e.png',
    description: 'iPhone 16 E phiên bản giá tốt.'
  },
  {
    id: 3,
    name: 'OPPO',
    price: 'Giá liên hệ',
    image: '/images/oppo.png',
    description: 'Điện thoại OPPO với thiết kế đẹp và camera ấn tượng.'
  },
  {
    id: 4,
    name: 'Samsung',
    price: 'Giá liên hệ',
    image: '/images/samsung.png',
    description: 'Điện thoại Samsung cao cấp với màn hình sắc nét.'
  },
  {
    id: 5,
    name: 'Samsung A3',
    price: 'Giá liên hệ',
    image: '/images/samsunga3.png',
    description: 'Điện thoại Samsung A3 giá rẻ, hiệu năng ổn định.'
  }
];

router.get('/', (req, res) => {
  res.render('phone', { products: phoneProducts, session: req.session });
});

router.get('/product-detail/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = phoneProducts.find(p => p.id === productId);
  if (product) {
    res.render('product-detail', { product: product, session: req.session });
  } else {
    res.send('Không tìm thấy sản phẩm');
  }
});

module.exports = router;