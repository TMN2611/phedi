const OrderModel = require("../models/Order")
const { mongooseToObject ,mutipleMongooseToObject} = require('../../util/mongoose');
const { numberToMoney } = require('../../util/numberToMoney')

const moment = require('moment');

const {exportTimeString} = require('../../util/time')
  const path = require('path')



class OrdersController {
  //  [GET]  / checkouts

 async index(req, res) {

    // find all documents
    let allOrder = await OrderModel.find({});
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
