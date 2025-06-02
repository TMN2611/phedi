





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

 async function updatePriceList (e,Item) {
  console.log(e,124)

    const data = await checkGrandOpening();
        const isGrandOpening = JSON.parse(data.isgrandOpening);

        let totalAmount

        const price = e.target.dataset.price;
        console.log("🚀 ~ updatePriceList ~ price:", price)

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
          if(price === "16000") {
            totalAmount= e.target.value * saltCoffeePrice;
          }
          if(price === "20000") {
            totalAmount= e.target.value * matchaLattePrice;
          }

        } 

       
        const totalAmountElement = Item.querySelector('.price');
        totalAmountElement.innerHTML = totalAmount;

        const totalAmountList = productList.querySelectorAll('.price');


        let total = 0;
        totalAmountList.forEach(function(item){

          total = total + Number(item.innerText);
        })

        // const discountPercent = await checkDiscount();
        
        let finalPrice = 0;

        function CalFinalPricePercent(discountPercent) {
          console.log( finalPrice = total - ((total*discountPercent)/100))
          return finalPrice = total - ((total*discountPercent)/100)
        }
       



        const finalMoneyElement15percent = document.querySelector('.finalMoney15percent');
        const totalElement15percent = document.querySelector('.total15percent');
        
        const finalMoneyElement10percent = document.querySelector('.finalMoney10percent');
        const totalElement10percent = document.querySelector('.total10percent');

        const finalMoneyElement5percent = document.querySelector('.finalMoney5percent');
        const totalElement5percent = document.querySelector('.total5percent');

        const finalPrice15percent = CalFinalPricePercent(15)
        const finalPrice10percent = CalFinalPricePercent(10)
        const finalPrice5percent = CalFinalPricePercent(5)

        finalMoneyElement15percent.innerText = `${finalPrice15percent}`
        totalElement15percent.innerText = `${total}`

        finalMoneyElement10percent.innerText = `${finalPrice10percent}`
        totalElement10percent.innerText = `${total}`

        finalMoneyElement5percent.innerText = `${finalPrice5percent}`
        totalElement5percent.innerText = `${total}`

        
        

  
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
    const saltCoffeePrice = 16;
    const matchaLattePrice = 20;

    const productList = document.querySelector('.productList')
    
    const productItemList = document.querySelectorAll('.productItem');

    productItemList.forEach( function(Item){

        let productAmount = Item.querySelector('input')

        productAmount.addEventListener('change', function(e) {
          updatePriceList(e, Item);
      });

    })



  const userNameElement = document.querySelector('#userName');
  const userPhoneNumberElement = document.querySelector('#userPhoneNumber');
  const userInfor = JSON.parse(localStorage.getItem('userInfor'));
  const userNote = JSON.parse(localStorage.getItem('userNote'));
  const userAddress = JSON.parse(localStorage.getItem('userAddress')) || "";
  console.log("🚀 ~ userAddress:", userAddress)
  const bill = JSON.parse(localStorage.getItem('bill'));

  const userNoteElement = document.querySelector('#userNote');
  if(userNoteElement) {
    userNoteElement.innerText = userNote

  }

  const userAddressElement = document.querySelector('#userAddress');
  if(userAddressElement) {
    userAddressElement.value = `${userAddress}`;

  }

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
            let billID = localStorage.getItem("billID");
            // Gọi API kiểm tra giảm giáapi
            let response = await fetch("api/check-discount/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ billID: billID }),
            });
    
            let data = await response.json();
            console.log("🚀 ~ applyDiscount ~ data:", data)
    
            let discountPercent = data.discount || 0; // Nếu không có giảm giá 
            let oldPrice = data.oldPrice; // Nếu không có giảm giá 
            let finalPrice = data.finalPrice; // Nếu không có giảm giá 
            let isReducedPrice = data.isReducedPrice; // Nếu không có giảm giá 
           
    
            //Cập nhật hiển thị trên giao diện
            document.getElementById("noteBill").innerHTML = `Bạn cần thanh toán <span class='text-yellow-bold'>${finalPrice}</span> (Đã giảm ${isReducedPrice}) <span class='text-yellow-bold'>Giảm ${discountPercent}%</span>`;
    
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
 
        const userAddress = document.querySelector('#userAddress').value
        console.log("🚀 ~ orderBtn.addEventListener ~ userAddress:", userAddress)

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
                  isPreOrder,
                  userAddress
              };
              console.log(orderData)
      
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
                          localStorage.setItem('userNote', JSON.stringify(userNote));
                          localStorage.setItem('userAddress', JSON.stringify(userAddress));
                          localStorage.setItem('timepicker', JSON.stringify(timepicker));
                          localStorage.setItem('billID', JSON.stringify(response.billID));
                          localStorage.setItem('discountPercent', JSON.stringify(response.discountPercent));
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


const timepickerElement = document.getElementById("timepicker");
if(timepickerElement) {
  timepickerElement.addEventListener("change", function() {
    let selectedTime = this.value; // Lấy giá trị giờ đã chọn
    let minTime = "06:00";
    let maxTime = "09:00";
  
    if (selectedTime < minTime) {
        this.value = minTime;
    } else if (selectedTime > maxTime) {
        this.value = maxTime;
    }
  });
}





// const priceGrandOpening = 10;
// const blackCoffeePrice = 13;
// const restCoffeePrice = 15;
// const saltCoffeePrice = 16;
// const matchaLattePrice = 20;
async function isGrandOpening () {
  const data = await checkGrandOpening();
  const isgrandOpeningData = await JSON.parse(data.isgrandOpening)
  return isgrandOpeningData

}


productItemList.forEach(async function(item){
  const productNameElement = item.querySelector('#productName');
  const totalAmountElement = item.querySelector('#totalAmount');

  const productNameValue =  productNameElement.innerText.trim();
  const isGrandOpeningValue = await isGrandOpening();


  if(bill) {
    bill.forEach(function (oldItem){
      if(productNameValue === oldItem.productName) {
        const ItemAmount = item.querySelector('#amount');
        const ItemPrice = item.querySelector('.price');
        const productPrice =  ItemAmount.dataset.price;
        ItemAmount.value = oldItem.qality;
        if(isGrandOpeningValue) {
          ItemPrice.innerText = oldItem.qality*10
        }
        else {
          ItemPrice.innerText = (oldItem.qality*ItemAmount.dataset.price)/1000

        }
        function loadFinalMoney() {
          const totalAmountList = document.querySelectorAll('.price');
        
          let total = 0;
        
          totalAmountList.forEach(item => {
            const price = Number(item.innerText) || 0;
            total += price;
          });
        
          // Hàm tính tiền sau giảm
          function calculateFinalPrice(total, discountPercent) {
            return total - (total * discountPercent / 100);
          }
        
          const finalPrices = {
            15: calculateFinalPrice(total, 15),
            10: calculateFinalPrice(total, 10),
            5: calculateFinalPrice(total, 5)
          };
        
          // Cập nhật UI
          document.querySelector('.finalMoney15percent').innerText = finalPrices[15].toFixed(0);
          document.querySelector('.total15percent').innerText = total.toFixed(0);
        
          document.querySelector('.finalMoney10percent').innerText = finalPrices[10].toFixed(1);
          document.querySelector('.total10percent').innerText = total.toFixed(0);
        
          document.querySelector('.finalMoney5percent').innerText = finalPrices[5].toFixed(1);
          document.querySelector('.total5percent').innerText = total.toFixed(1);
        }
        loadFinalMoney()
        
      }
  })
  }

  
})

document.addEventListener('DOMContentLoaded', function () {
  const datepickerInput = document.querySelector('#datepicker');
  if (datepickerInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const day = String(tomorrow.getDate()).padStart(2, '0');
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // JS month starts from 0
    const year = tomorrow.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    datepickerInput.value = formattedDate;
  }
});

 // Gán lại nếu có sẵn trong localStorage
 const timeInput = document.getElementById('timepicker');
 if(timeInput) {
  window.addEventListener('DOMContentLoaded', function () {
    const savedTime = localStorage.getItem('timepicker');
    console.log("🚀 ~ savedTime:", savedTime)
    if (savedTime) {
      timeInput.value = savedTime;
    }
    console.log(timeInput.value);
  });
     
 }



 

console.log(userInfor)
if(userInfor) {
  getCurrentPoints(userInfor.userPhoneNumber)
}
 async function getCurrentPoints(phoneNumber) {
  try {
    const response = await fetch('/api/get-current-points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Số điểm hiện tại:", data.availablePoints);
      // Cập nhật UI nếu muốn
      const currentPointDisplayElement = document.querySelector('#currentPointDisplay')
      if(currentPointDisplayElement) {
        currentPointDisplayElement.innerText = `${data.availablePoints} điểm`;
      }
      return data.availablePoints;
    } else {
      alert(data.message || "Có lỗi xảy ra khi lấy điểm.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API getCurrentPoints:", error);
    alert("Không thể kết nối máy chủ.");
  }
}

