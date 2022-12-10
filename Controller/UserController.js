const User = require('../Schemas/UserSchema');

module.exports.GET_ALL_USER = (async (req, res) => {
    try {
        await User.find()
        .exec()
        .then(response => {
            if(response){
                res.status(200).json(response)
            }
        })
        .catch();        
    }
    catch (err) {
        res.send("error : ", err);
    }
})


module.exports.GET_USER_BY_ID = (async (req, res) => {
    try {
        await User.findById(req.params.id).select('_id username phoneNumber email password')
        .exec()
        .then(response => {
            if(response){
                res.status(200).json(response);
            }
            else{
                res.status(404).send({
                    message : "User Not Found!"
                })
            }
        })
        .catch();
    }
    catch (err) {
        res.send("Error : ", err)
    }
})

module.exports.LOGIN_USER = (async (req, res) => {
    try {
        User.findOne({ phoneNumber: req.body.phoneNumber, password: req.body.password }, (err, response) => {
            if (response) {
                res.status(200).json({
                    _id: response._id,
                    username: response.username,
                    email: response.email,
                    phoneNumber: response.phoneNumber,
                    password: response.password
                })
            }
            res.status(404).send({
                message: "User Not Found!"
            })
        });
    }
    catch (err) {
        res.send("Error : ", err);
    }
})

module.exports.SIGNUP_USER = (async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
    })

    try {
        await user.save();
        res.status(201).json({
            message: "User created successfully!",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                password: user.password
            }
        })
    }
    catch (err) {
        res.send(err)
    }
})

module.exports.EDIT_USER_NUMBER = (async (req, res) => {
    try {
        User.findByIdAndUpdate(req.params.userId, { phoneNumber: req.body.phoneNumber },
            { new: true },
            (err, response) => {
                if(response){
                    res.status(200).send({
                        message : "Edited Successfully!"
                    })
                }
            })
    }
    catch (err) {
        res.send("error : ", err);
    }
})