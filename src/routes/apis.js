const express = require('express');

const router = express.Router();

const ApisController = require('../app/controllers/ApisController');

router.post('/order-update/', ApisController.updateOrderStatus);

router.post('/check-new-order/', ApisController.checkNewOrder);




module.exports = router;

