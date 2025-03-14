const OrderModel = require("../models/Order")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { numberToMoney } = require('../../util/numberToMoney')

const moment = require('moment-timezone');

const {exportTimeString} = require('../../util/time')
  const path = require('path')



class OrdersController {
  //  [GET]  / checkouts

 async index(req, res) {
  const filter = req.params.filter; // Lấy giá trị filter từ URL
  console.log("🚀 ~ OrdersController ~ index ~ filter:", filter)

    // find all documents


    let allOrder =[]
    const today = moment().tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
    const tomorrow = moment().tz("Asia/Ho_Chi_Minh").add(1, 'day').format("DD/MM/YYYY");

    const todayStart = moment().tz("Asia/Ho_Chi_Minh").startOf('day').toDate();
    const todayEnd = moment().tz("Asia/Ho_Chi_Minh").endOf('day').toDate();

if (filter === 'today') {
    // Lọc đơn hàng có ngày nhận hôm nay
    allOrder = await OrderModel.find({ datepicker: today });
} else if (filter === 'tomorrow') {
    // Lọc đơn hàng có ngày nhận ngày mai
    allOrder = await OrderModel.find({ datepicker: tomorrow });
} 
else if (filter === 'orderAtToday') {
     // Lọc đơn hàng được tạo trong ngày hôm nay
     allOrder = await OrderModel.find({ 
      createdAt: { $gte: todayStart, $lt: todayEnd } 
  });
} 

else {
    // Nếu không có filter, lấy tất cả đơn hàng
    allOrder = await OrderModel.find({});
}
    
    let allOrderList = mutipleMongooseToObject(allOrder);

    allOrderList = allOrderList.map(function(order) {
       const dateObj = new Date(order.createdAt);
      // Lấy ngày, tháng, năm
        const day = String(dateObj.getDate()).padStart(2, "0"); // 02
        const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // 03 (Tháng tính từ 0)
        const year = dateObj.getFullYear(); // 2025

        const formattedDate = `${day}/${month}/${year}`;
        order.createdAt = formattedDate
      return order
    })


    OrderModel.watch().
        on('change', data => console.log(data,123));
      
     res.render('order', {
      allOrder: allOrderList.reverse(),
    });
  }

  async handleOrder(req, res) {
    try {
            
        let {userInfor,productInfor,note,datepicker,
          timepicker,isPreOrder} = req.body;
   
              let finalMoney = 0;
              
              const priceGrandOpening = 10;
              const blackCoffeePrice = 12;
              const restCoffeePrice = 15;
           
              productInfor.forEach(function(item){
                finalMoney = finalMoney + (item.qality*priceGrandOpening);
              })
             
              
              const dataForSave = {
                finalPrice:finalMoney,
                userInfor,
                productInfor:productInfor,
                note,
                datepicker,
                timepicker,     
                isPreOrder,
              }

           


               OrderModel.create(dataForSave)
                .then((result) => {
                  

                    res.json({isError:false,message:"Đặt hàng thành công, vui lòng kiểm tra email và chờ CSKH liên hệ",billID:result.orderCode});
                })
                .catch((err) => {
                  console.log(err)
                  res.send({ isError: true, message: 'kết nối DB thất bại' })
                })


              
                
                 
                  
              
  

                
      
    } catch (error) {
        console.log(error)
    }

  }

}

module.exports = new OrdersController();
