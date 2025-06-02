const express = require('express');

const router = express.Router();

const ApisController = require('../app/controllers/ApisController');

router.post('/order-update/', ApisController.updateOrderStatus);

router.post('/check-new-order/', ApisController.checkNewOrder);

router.post('/check-isgrandOpening/', ApisController.isgrandOpening);

router.post('/check-discount/', ApisController.isDiscount);

router.post('/get-current-points/', ApisController.getCurrentPoints);

router.post('/doidiem/', ApisController.doidiem);

router.post('/check-user', ApisController.checkUser);





module.exports = router;

