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
    const saltCoffeePrice = 16;
    const matchaLattePrice = 20;
    const restCoffeePrice = 15;

    // let discountPercent = Number(process.env.DISCOUNTPERCENT); // Nếu không có giảm giá thì discount = 0
    let finalMoney = 0;

   
    // Giả sử allOrderList là danh sách đơn hàng
    allOrderList = allOrderList.map(order => {
      const discountPercent = order.discount;
      const oldPrice = order.oldPrice;
      const finalPrice = order.finalPrice;
      const amountIsReduced = (order.oldPrice - order.finalPrice)*1000;
      return {...order,total:oldPrice,finalPrice,amountIsReduced:amountIsReduced.toFixed(0)} 
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

              console.log(productInfor)
              
            
              const priceGrandOpening = 10;
              const blackCoffeePrice = 13;
              const restCoffeePrice = 15;
              const saltCoffeePrice = 16;
              const matchaLattePrice = 20;

              const isGrandOpening = JSON.parse(process.env.ISGRANDOPENING);
      
           
              productInfor.forEach(function(item){
                if(isGrandOpening) {
                  finalMoney = finalMoney + (item.qality*priceGrandOpening);
                }
                else {
                  if (item.productName === 'Cà Phê Đen') {
                    finalMoney += item.qality * blackCoffeePrice;
                  } else if (item.productName === 'Cà Phê Sữa') {
                    finalMoney += item.qality * restCoffeePrice;
                  } else if (item.productName === 'Bạc Xỉu') {
                    finalMoney += item.qality * restCoffeePrice; // nếu Bạc Sỉu cũng giá như muối
                  } else if (item.productName === 'Cà Phê Muối') {
                    finalMoney += item.qality * saltCoffeePrice;
                  } else if (item.productName === 'Matcha Latte') {
                    finalMoney += item.qality * matchaLattePrice;
                  } else {
                    console.warn('Sản phẩm không xác định:', item.productName);
                  }
                }
              })

              function getRandomDiscountPercent() {
                const random = Math.random();
                if (random < 0.3) return 15;
                if (random < 0.7) return 10;
                return 5;
              }
              
              const oldPrice = finalMoney;
              let discountPercent =   getRandomDiscountPercent();
              if(process.env.NODISCOUNT === "true") {
                discountPercent = 0;
              }
              console.log(discountPercent);
              finalMoney = finalMoney - (finalMoney * discountPercent / 100);
             
              
              const dataForSave = {
                finalPrice:finalMoney,
                userInfor,
                productInfor:productInfor,
                note,
                datepicker,
                timepicker,     
                isPreOrder,
                discount:discountPercent,
                oldPrice
              }
              console.log(dataForSave)

           


               OrderModel.create(dataForSave)
                .then((result) => {
                  

                    if(discountPercent > 0) {
                      res.json({isError:false,message:`QUÝ KHÁCH ĐÃ NHẬN MÃ GIẢM GIÁ ${discountPercent}% cho đơn hàng này ❤️ Cảm ơn quý khách ạ 😍`,billID:result.orderCode,discountPercent});
                    }
                    else {
                      res.json({isError:false,message:"Đặt hàng thành công, Cảm ơn quý khách ạ",billID:result.orderCode,discountPercent});
                    }
                   
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
