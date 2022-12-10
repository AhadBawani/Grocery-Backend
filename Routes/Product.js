const express = require('express');
const ProductController = require('../Controller/ProductController');
const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./Images");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


router.get('/', ProductController.GET_ALL_PRODUCTS);
router.post('/', upload.single('productImage'),ProductController.ADD_PRODUCT);
router.patch('/:productId', ProductController.EDIT_DISABLED_PRODUCT);
router.delete('/:productId', ProductController.DELETE_PRODUCT);


module.exports = router;