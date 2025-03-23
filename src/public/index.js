





//<!-- input onchange -->

  // Gọi API kiểm tra có phải giá 10k không
  async function checkGrandOpening ()
  {
    let response = await fetch("api/check-isgrandOpening/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
  });
  
  let data = await response.json();

  
  return data;
  }

async function checkDiscount () {
 // Gọi API kiểm tra giảm giáapi
 let response = await fetch("api/check-discount/", {
  method: "POST",
  headers: {
      "Content-Type": "application/json",
  },
});

let data = await response.json();

let discountPercent = data.discount || 0;
return discountPercent;
}
     


    const priceGrandOpening = 10;
    const blackCoffeePrice = 13;
    const restCoffeePrice = 15;

    const productList = document.querySelector('.productList')
    
    const productItemList = document.querySelectorAll('.productItem');

    productItemList.forEach( function(Item){

        let productAmount = Item.querySelector('input')

        productAmount.addEventListener('change', async function(e){

          const data = await checkGrandOpening();
              const isGrandOpening = JSON.parse(data.isgrandOpening);

              let totalAmount

              const price = e.target.dataset.price;

              if(isGrandOpening) {
                totalAmount= e.target.value * priceGrandOpening;
              }
              else {

                if(price === "13000") {
                  totalAmount= e.target.value * blackCoffeePrice;
                }
  
                if(price === "15000") {
                  totalAmount= e.target.value * restCoffeePrice;
                }
  
              } 

             
              const totalAmountElement = Item.querySelector('.price');
              totalAmountElement.innerHTML = totalAmount;

              const totalAmountList = productList.querySelectorAll('.price');


              let total = 0;
              totalAmountList.forEach(function(item){

                total = total + Number(item.innerText);
              })
              const discountPercent = await checkDiscount();
              let finalPrice = 0;

              if(discountPercent) {
                finalPrice = total - ((total*discountPercent)/100)
              }
              else {
                finalPrice = total
              }



              const finalMoneyElement = document.querySelector('.finalMoney');
              const totalElement = document.querySelector('.total');

              finalMoneyElement.innerText = `${finalPrice}`
              totalElement.innerText = `${total}`

              
              

        })     

    })



  const userNameElement = document.querySelector('#userName');
  const userPhoneNumberElement = document.querySelector('#userPhoneNumber');
  const userInfor = JSON.parse(localStorage.getItem('userInfor'));
  const bill = JSON.parse(localStorage.getItem('bill'));

  const BillIDStorageValue = localStorage.getItem('billID')
  let billID;
  if(BillIDStorageValue !== 'undefined') { 
     billID = JSON.parse(BillIDStorageValue);
  }

  if(userInfor && userNameElement) {
    if (userInfor.userName) {
      
      userNameElement.value = userInfor.userName
      userPhoneNumberElement.value = userInfor.userPhoneNumber
    }
  
    if (bill.length > 0) {
      const productBillElement = document.querySelector("#productBill");
      const billIDElement = document.querySelector("#billID");
  
  
      
      if(billID) {
        billIDElement.innerHTML = `Mã đơn hàng: <span class='billIDcontent'>${billID} <span class='billIDcopy'><i class="fa-regular fa-copy"></i> </span></span>`
      }
  
  
      let html = bill.map((product,index)=> {
  
        return `${product.productName} - SL: ${product.qality}</p>`
      })
  
  
      
  
  
                // let finalMoney = 0;
                // bill.forEach(function(item){
  
                //   finalMoney = finalMoney + Number(item.qality);
                // })
  
              
  
     
                
      // html = html.concat(`Bạn cần thanh toán ${finalMoney * priceGrandOpening}`)
  
      productBill.innerHTML = html.join('');




      async function applyDiscount(bill) {
        try {
            // Gọi API kiểm tra giảm giáapi
            let response = await fetch("api/check-discount/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            let data = await response.json();
    
            let discountPercent = data.discount || 0; // Nếu không có giảm giá 
            async function calcOrderTotal(bill, discountPercent,priceGrandOpening) {
              let total = 0;
              const data = await checkGrandOpening();
              const isGrandOpening = JSON.parse(data.isgrandOpening);
            
              bill.forEach(product => {
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
            const {finalPrice,total,amountIsReduced} = await calcOrderTotal(bill, discountPercent,priceGrandOpening);
    
            //Cập nhật hiển thị trên giao diện
            document.getElementById("noteBill").innerHTML = `Bạn cần thanh toán <span class='text-yellow-bold'>${finalPrice}</span> (Đã giảm ${amountIsReduced}) <span class='text-yellow-bold'>Giảm ${discountPercent}%</span>`;
    
        } catch (error) {
            console.error("Lỗi khi gọi API giảm giá:", error);
        }
    }
    applyDiscount(bill);
    
    }
  }





 

 


//{{!-- order handle --}}

	const orderBtn = document.querySelector('.orderBtn');

  if(orderBtn) {
    orderBtn.addEventListener("click",async (e)=> {

      try {
        //const userInfor = JSON.parse(localStorage.getItem("userInfor"));
        //const productInfor = JSON.parse(localStorage.getItem("cartProductList"));
        
  
        //const discountCodeList = JSON.parse(localStorage.getItem("discountCode"))|| [] ;
  
        //const discountCode=discountCodeList.map((item)=> item.id) ;
  
        //const shipmentFee = document.querySelector('.total__feeShip--price').innerHTML;
        
  
        //const totalPriceFromFetch =await getTotalPrice();
  
  
        //const orderPayOption = document.querySelector('.order__pay--option .tab__item.active').innerText.trim();
  
        const note = document.querySelector('#userNote').value;
  
  
        
  
        const userName = document.querySelector('#userName').value
        const userPhoneNumber = document.querySelector('#userPhoneNumber').value
        const datepicker = document.querySelector('#datepicker').value
        const timepicker = document.querySelector('#timepicker').value
 
        const userAddress = document.querySelector('#userAdress').value

        const userNote = document.querySelector('#userNote').value

        let isPreOrder = false;
        const orderDateTime = document.querySelector('.orderDateTime.active');
        if(orderDateTime) {
          isPreOrder = true;
        }

        console.log(isPreOrder)
   

  
        const userInfor = {userName, userPhoneNumber}
        
        const productInfor = []
  
        const productItems = document.querySelectorAll('.productItem');
  
        productItems.forEach(product=> {
          const productName = product.querySelector('#productName').innerText
          const qality = Number(product.querySelector('#amount').value)
          if (qality > 0 ) 
          productInfor.push({productName,qality})
        })
  
        // isaddproduct
  
        function isAddproductfn() {
              const productItemsElement = document.querySelectorAll('.productItem');
  
  
              let isAddproduct = false;
               productItemsElement.forEach(product=> {
                
                const qality = Number(product.querySelector('#amount').value)
                if (qality > 0 ) 
                  isAddproduct =  true
              })
              return isAddproduct
        }
        const isAddproduct = isAddproductfn()
     
  
  
  
  
  
  
        switch (true) {
          case !userName:
              alert('Quên khum nhập tên rồi ạ');
              break;
      
          case !userPhoneNumber:
              alert('Số điện thoại má ơi');
              break;
      
          case isPreOrder === true && (!datepicker || !timepicker):
              alert('Quên nhập thời gian nhận hàng kìa ní,');
              break;
      
          // case isPreOrder === true && !userAddress:
          //     alert('Vui lòng nhập địa chỉ nhận hàng ạ ^.^');
          //     break;
      
          case !isAddproduct:
              alert('Vui lòng đặt tối thiểu 1 sản phẩm ạ khách yêu');
              break;
      
          default:
              const orderData = {
                  userInfor,
                  productInfor,
                  note: userNote,
                  datepicker,
                  timepicker,
                  isPreOrder
              };
      
              function order(orderData) {
                  fetch('/2205/handle-order', {
                      method: 'POST',
                      headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(orderData)
                  })
                  .then(response => response.json())
                  .then((response) => {
                      alert(response.message);
                      if (!response.isError) {
                          window.location.pathname = '/home';
                          localStorage.setItem('bill', JSON.stringify(productInfor));
                          localStorage.setItem('userInfor', JSON.stringify(userInfor));
                          localStorage.setItem('billID', JSON.stringify(response.billID));
                      }
                  });
              }
              order(orderData);
      }
      
  
  
      
        
        
      
  
  
      }
      catch(err) {
      console.log(err);
      alert("Có lỗi , vui lòng thử lại");
  
      }
    
    })
  }


         



  jQuery(function ($)
{
  $.datepicker.regional["vi-VN"] =
	{
		closeText: "Đóng",
		prevText: "Trước",
		nextText: "Sau",
		currentText: "Hôm nay",
		monthNames: ["Tháng một", "Tháng hai", "Tháng ba", "Tháng tư", "Tháng năm", "Tháng sáu", "Tháng bảy", "Tháng tám", "Tháng chín", "Tháng mười", "Tháng mười một", "Tháng mười hai"],
		monthNamesShort: ["Một", "Hai", "Ba", "Bốn", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Mười một", "Mười hai"],
		dayNames: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
		dayNamesShort: ["CN", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy"],
		dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
		weekHeader: "Tuần",
		dateFormat: "dd/mm/yy",
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ""
	};

	$.datepicker.setDefaults($.datepicker.regional["vi-VN"]);

});


//Event Listener

const datepickerInput = document.querySelector('#datepicker');
const datepickerLabel = document.querySelector('.datepicker-label');

if(datepickerInput) {
  datepickerInput.addEventListener('focus', (e) => {
    datepickerLabel.style.display = 'none';
  })
  datepickerInput.addEventListener('focusout', (e) => {
    if(e.target.value.length===0) {
    }

   
  })
}


// Order Page

const orderStuatusBtn = document.querySelectorAll('.order-status-btn');

if(orderStuatusBtn) {
  orderStuatusBtn.forEach((btn)=> {
    btn.addEventListener('click', (e) => {
      const orderid = e.target.dataset.orderid;

     
      async function updateOrderStatus(orderStatus, orderCode) {

        
        if(orderStatus == 'Done') {
          orderStatus = 'notDone'
        } 
        else {
          orderStatus = 'Done'  

        }

        try {
            const response = await fetch(`/api/order-update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: orderStatus, orderCode }),
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log("Cập nhật thành công:", data);
                location.reload();
            } else {
                console.error("Lỗi:", data.message);
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
        }
    }
    
    // Gọi hàm
    let orderStatus = e.target.dataset.orderstatus;

    
    updateOrderStatus(orderStatus,orderid);
    
      

    })
  })
}


let orderStatusBtnListList = document.querySelectorAll('.order-status-btn');

orderStatusBtnListList.forEach((btn)=> {
  if (btn?.innerText === 'Done') {
    btn.classList.add('btn-green')
  }
  else {
    btn.classList.add('btn-red')
  
  }
})

const orderDateTime = document.querySelector('.orderDateTime');
const preOrderCheckBox = document.querySelector('#preOrder');
if(preOrderCheckBox) {
    
  preOrderCheckBox.addEventListener('change', function() {
      if (this.checked) {
        console.log("Checkbox is checked..");
        orderDateTime.classList.add('active')
      } else {
        orderDateTime.classList.remove('active')

        console.log("Checkbox is not checked..");
      }
    });
}





  


const billIDcopyEmlement = document.querySelector('.billIDcopy');
const billIDcontentEmlement = document.querySelector('.billIDcontent');

if(billIDcopyEmlement) {

  billIDcopyEmlement.addEventListener('click',()=> {
    // Copy the text inside the text field
  navigator.clipboard.writeText(billIDcontentEmlement.innerText);
    // Alert the copied text
    alert("Đã copy: " + billIDcontentEmlement.innerText);
  })
}


document.getElementById("timepicker").addEventListener("change", function() {
  let selectedTime = this.value; // Lấy giá trị giờ đã chọn
  let minTime = "06:00";
  let maxTime = "09:00";

  if (selectedTime < minTime) {
      this.value = minTime;
  } else if (selectedTime > maxTime) {
      this.value = maxTime;
  }
});