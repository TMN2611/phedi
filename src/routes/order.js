const express = require('express');

const router = express.Router();

const OrdersController = require('../app/controllers/OrdersController');
// const {requireToken} = require('../middleware/auth')

router.get('/', OrdersController.index);
router.get('/:filter', OrdersController.index);



router.post('/handle-order', OrdersController.handleOrder);


module.exports = router;
