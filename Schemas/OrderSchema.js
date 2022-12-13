const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    orderId:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        ref:'Product',
        required:true
    },    
})

module.exports = mongoose.model('Order', OrderSchema);