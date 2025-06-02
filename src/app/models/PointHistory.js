var mongoose = require('mongoose');


var PointHistory = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    phone: String,
    usedPoints:Number,
    reason:String,
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Point_History', PointHistory);
