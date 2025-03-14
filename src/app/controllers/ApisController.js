const OrderModel = require("../models/Order");
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const moment = require('moment');

const {makeNumberSorter} = require('../../util/makeNumberSorter')
class ApisController {
  //  [POST]  / products
  // GET /apis/brand-list

  async updateOrderStatus(req, res) {


      let { status, orderCode} = req.body;
      console.log("🚀 ~ ApisController ~ updateOrderStatus ~ orderCode:", status)

      try {
        
          const order = await OrderModel.findOneAndUpdate({orderCode}, { status, }, { new: true });
         
          
          if (!order) {
              return res.status(404).json({ message: "Đơn hàng không tồn tại" });
          }
          
          res.json({ message: "Cập nhật thành công", order });
      } catch (error) {

        console.log(error);

          // res.status(500).json({ message: "Lỗi server", error });
      }


  }


  async checkNewOrder(req, res) {


    let { currentOrderNum} = req.body;
    console.log("🚀 ~ ApisController ~ checkNewOrder ~ currentOrderNum:", currentOrderNum)

    try {
      
        const order = await OrderModel.find({});
       
         console.log(order.length)
        
        if (order.length > currentOrderNum) {
          res.json({ message: "Bạn đã có 1 đơn hàng mới", newOrder:true });
          console.log('Bạn đã có 1 đơn hàng mới')

        }
        
    } catch (error) {

      console.log(error);

        res.status(500).json({ message: "Lỗi server", error });
    }


}

  async isDiscount(req, res) {
    res.json({discount:10})
  }


 
}

module.exports = new ApisController();
