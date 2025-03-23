const OrderModel = require("../models/Order")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { numberToMoney } = require('../../util/numberToMoney')

const moment = require('moment-timezone');

const {exportTimeString} = require('../../util/time')
  const path = require('path');
const e = require("cors");



class OrdersController {
  //  [GET]  / checkouts

 async index(req, res) {
  const filter = req.params.filter; // Lấy giá trị filter từ URL

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
else if (filter === 'all') {
     // Lọc đơn hàng được tạo trong ngày hôm nay
     allOrder = await OrderModel.find({});

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

    
    const isGrandOpening = JSON.parse(process.env.ISGRANDOPENING);

    const priceGrandOpening = 10;
    const blackCoffeePrice = 13;
    const restCoffeePrice = 15;
    let discountPercent = Number(process.env.DISCOUNTPERCENT); // Nếu không có giảm giá thì discount = 0
    let finalMoney = 0;

    // Tính tổng tiền từ bill
    function calcOrderTotal(order, discountPercent,priceGrandOpening) {
      let total = 0;
    
      order.productInfor.forEach(product => {
        let unitPrice = 0;
    
        if(isGrandOpening) {
          unitPrice = priceGrandOpening
        }
        else {
          if (product.productName === 'Cà Phê Đen') {
            unitPrice = blackCoffeePrice;
          } else {
            unitPrice = restCoffeePrice;
          }
        }
       
    
        total += unitPrice * product.qality;
      });
    
      // Áp dụng giảm giá nếu có
      let finalPrice = total;
      if (discountPercent > 0) {
        finalPrice = total - (total * discountPercent / 100);
      }
      let amountIsReduced =total - finalPrice;
      amountIsReduced =  `${amountIsReduced.toFixed(3)} Đồng`;;
    
      return {total,finalPrice,amountIsReduced};
    }
    
    // Giả sử allOrderList là danh sách đơn hàng
    allOrderList = allOrderList.map(order => {
      const {total,finalPrice,amountIsReduced} = calcOrderTotal(order, discountPercent,priceGrandOpening);
    
      return {...order,total,finalPrice,amountIsReduced} 
    });


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
