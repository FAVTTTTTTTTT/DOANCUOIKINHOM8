const express = require('express');
const router = express.Router();

const laptopProducts = [
  {
    id: 1,
    name: 'Laptop ASUS ROG Strix',
    price: 'Giá liên hệ',
    image: '/images/laptopasusrogstrix.png',
    description: 'Laptop gaming mạnh mẽ từ ASUS ROG Strix.'
  },
  {
    id: 2,
    name: 'Laptop Dell XPS',
    price: 'Giá liên hệ',
    image: '/images/laptopdellxps.png',
    description: 'Laptop Dell XPS cao cấp, thiết kế mỏng nhẹ.'
  },
  {
    id: 3,
    name: 'Laptop HP',
    price: 'Giá liên hệ',
    image: '/images/laptophp.png',
    description: 'Laptop HP đa năng, phù hợp cho công việc và giải trí.'
  },
  {
    id: 4,
    name: 'Laptop Lenovo',
    price: 'Giá liên hệ',
    image: '/images/laptoplenovo.png',
    description: 'Laptop Lenovo với hiệu năng ổn định và giá cả hợp lý.'
  },
  {
    id: 5,
    name: 'Laptop Macbook Air',
    price: 'Giá liên hệ',
    image: '/images/laptopmacbookair.png',
    description: 'Laptop Macbook Air mỏng nhẹ, hiệu năng cao từ Apple.'
  }
];

router.get('/', (req, res) => {
  res.render('laptop', { products: laptopProducts, session: req.session });
});

router.get('/product-detail/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = laptopProducts.find(p => p.id === productId);
  if (product) {
    res.render('product-detail', { product: product, session: req.session });
  } else {
    res.send('Không tìm thấy sản phẩm');
  }
});

module.exports = router;