const Order = require('../Schemas/OrderSchema');
const Product = require('../Schemas/ProductSchema');
const User = require('../Schemas/UserSchema');
require('dotenv/config');


module.exports.GET_USER_ORDER = (async (req, res) => {
    User.findById(req.params.userId)
        .exec()
        .then(response => {
            if (response) {
                Order.find({ userId: req.params.userId })
                    .select('_id orderId userId')
                    .populate('productId', '_id productName productImage price category description mrp discount disabled')
                    .exec()
                    .then(response => {                        
                        if (response) {
                            res.status(200).send(response);
                        }
                    })
                    .catch(err => {
                        res.send({
                            message: err.message
                        })
                    });
            }
            else {
                res.status(404).send({
                    message: "User Not Found!"
                })
            }
        })
        .catch(err => {
            res.send({
                message: err.message
            })
        });
})


module.exports.DELETE_ORDER = (async (req, res) => {
    Order.deleteOne({ _id: req.params.orderId })
        .exec()
        .then(response => {
            if (response.deletedCount > 0) {
                res.status(200).send({
                    message: "Deleted Successfully!"
                })
            }
            else {
                res.status(404).send({
                    message: "Order Not Found!"
                })
            }
        })
        .catch(err => {
            res.send({
                message: err.message
            })
        });
})

module.exports.PLACE_ORDER = (async (req, res) => {
    for (let i = 0; i < req.body.length; i++) {
        var orderId = 0;
        Product.findById(req.body[i]?.productId)
            .then(response => {
                if(response){
                    Order.find({ orderId: { $gt: 0 } })
                    .exec()
                    .then(response => {
                        if(response.length == 0){
                            var order = new Order({
                                orderId: process.env.START_ORDER,
                                userId: req.body[i]?.userId,
                                productId: req.body[i]?.productId
                            })
                            order.save();
                            orderId = order?.orderId || process.env.START_ORDER;
                        }
                        else{                            
                            var order = new Order({
                                orderId: (response[response.length - 1]?.orderId + 1),
                                userId: req.body[i]?.userId,
                                productId: req.body[i]?.productId
                            })
                            order.save();
                            orderId = (response[response.length - 1]?.orderId + 1);
                        }
                    })
                    .catch();
                }
                else{
                    res.status(404).send({
                        message : "Product not Found!"
                    })
                }
            })
    }
    Order.find({ orderId: { $gt: 0 } })
    .exec()
    .then(response => {
        res.status(200).send({
            message : "Order Placed Successfully!",
            ordeId : response[response.length - 1]?.orderId
        })
    })
    .catch();
})

module.exports.ORDER_DELIVERED = (async (req, res) => {
    Order.find({ orderId: req.params.orderId })
        .exec()
        .then(response => {
            if (response.length > 0) {
                Order.updateMany({ orderId: req.params.orderId }, { delivered: true })
                    .exec()
                    .then(response => {
                        console.log(response);
                        res.send("console")
                    })
                    .catch();
            }
            else {
                res.status(404).send({
                    message: "Order Not Found!"
                })
            }
        })
        .catch();
})