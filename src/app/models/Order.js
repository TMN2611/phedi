var mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const options = {
  separator: "",
  lang: "en",
  truncate: 120
}
mongoose.plugin(slug,options);

var Order = mongoose.Schema(
  {
    idPreword: { type: String, default: 'DH', required: true },
    orderCode: { type: String, slug: ['idPreword', '_id'], unique: true, slug_padding_size: 4 },

    price: Number,
    ship: Number,
    finalPrice: Number,
    discount:Number,
    userInfor:Object,
    orderPayOption:String,
    datepicker: String, // Datepicker sẽ lưu vào đây
    timepicker: String, // Timepicker lưu dưới dạng HH:mm
    productInfor:[{type:Object}],
    note:String,
    status:{type:String,default:'notDone'},
    isPreOrder: Boolean,

    
  },
  { timestamps: true, versionKey: false }
);
// Ensure orderCode is always set
Order.pre('save', function (next) {
  if (!this.orderCode) {
    console.log(this.datepicker)

   
    const ddMMyyyy = this.datepicker.replace(/\//g, "");
    const randomPart = Math.floor(100 + Math.random() * 900); // Số ngẫu nhiên 4 chữ số

    this.orderCode =`DH${ddMMyyyy}-${randomPart}`;
  }
  next();
});
module.exports = mongoose.model('Order', Order);
