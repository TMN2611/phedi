const OrderModel = require("../models/Order");
const PointHistoryModel = require("../models/PointHistory");
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const moment = require('moment');

const {makeNumberSorter} = require('../../util/makeNumberSorter')
class ApisController {
  //  [POST]  / products
  // GET /apis/brand-list

  async updateOrderStatus(req, res) {


      let { status, orderCode} = req.body;

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
  try {
    let { billID } = req.body;
    console.log(billID)
    billID = JSON.parse(billID);
    console.log("🚀 ~ ApisController ~ isDiscount ~ billID:", billID)

    if (!billID) {
      return res.status(400).json({ error: "Missing billID" });
    }

    const order = await OrderModel.findOne({ orderCode: billID });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const isReducedPrice = (order.oldPrice - order.finalPrice)*1000

    res.json({ discount: order.discount || 0 , oldPrice:order.oldPrice, finalPrice:order.finalPrice,isReducedPrice:isReducedPrice.toFixed(0),status:order.status});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


  async isgrandOpening(req, res) {

    const isgrandOpening = process.env.ISGRANDOPENING;
    res.json({isgrandOpening})
  }

  async  getCurrentPoints (req, res)  {
    const { phone } = req.body;
  
    try {
      const orders = await OrderModel.find({ "userInfor.userPhoneNumber": phone, status:'Done' });
      const history = await PointHistoryModel.find({ "phone": phone });
      console.log("🚀 ~ ApisController ~ getCurrentPoints ~ orders:", orders)
  
      const totalPoints = orders.reduce((sum, order) => sum + (order.discount || 0), 0);
      const usedPoints = history.reduce((sum, item) => sum + (item.usedPoints || 0), 0);
  
      const availablePoints = totalPoints - usedPoints;
  
      res.json({ availablePoints });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  }

  async  doidiem (req, res)  {
    const { phone, reason } = req.body;
    console.log("🚀 ~ ApisController ~ doidiem ~ phone:", phone)
    try {
      const orders = await OrderModel.find({ "userInfor.userPhoneNumber": phone, status:"Done" });

      const history = await PointHistoryModel.find({ "phone": phone });
  
      const totalPoints = orders.reduce((sum, order) => sum + (order.discount || 0), 0);
  
      const historyPoints = history.reduce((sum, item) => sum + (item.usedPoints || 0), 0);

      const availablePoints = totalPoints - historyPoints;
      console.log("🚀 ~ ApisController ~ doidiem ~ history:", historyPoints)
      console.log("🚀 ~ ApisController ~ doidiem ~ totalPoints:", totalPoints)
      console.log("🚀 ~ ApisController ~ doidiem ~ availablePoints:", availablePoints)

      if (availablePoints < 150) {
        return res.status(400).json({ message: `Còn ${availablePoints} điểm. Không đủ điểm để đổi. Cần ít nhất 150 điểm.` });
      }

          // Lưu bản ghi điểm đã sử dụng
    const usedPointRecord = new PointHistoryModel({
      phone,
      usedPoints:150,
      reason,
      createdAt: new Date()
    });

    await usedPointRecord.save();

    res.json({ message: 'Đổi điểm thành công', used: 150 });
    
    } catch (err) {
      console.log("🚀 ~ ApisController ~ doidiem ~ err:", err)
      res.status(500).json({ message: 'Lỗi server' });
    }
   
  }

  // [POST] /api/check-user
async checkUser(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: 'Thiếu số điện thoại' });
    }

    const order = await OrderModel.findOne({ "userInfor.userPhoneNumber": phone, status:'Done' });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }

    // Trả về một vài thông tin nếu cần
    res.json({
      name: order.userInfor.userName || '',
      phone: order.userInfor.userPhoneNumber,
      message: 'Tìm thấy khách hàng'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}



 
}

module.exports = new ApisController();
