const Product = require("../../models/Product");
const Adminauth = require("../../models/Adminauth");
const Coupon = require("../../models/Coupon");
const Setting = require("../../models/Setting");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
const imageFilter = require("../../config/imageFilter");
const fs = require("fs");
const moment = require("moment");

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/product"),
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: imageFilter,
}).fields([
  {
    name: "image",
    maxCount: 1,
  },
  {
    name: "icon",
    maxCount: 1,
  },
]);

class ProductController {
  static list = async (req, res) => {
    const product = await Product.find();
    const admin = await Adminauth.find({});
    const settingRecord = await Setting.findOne({});
    return res.render("admin/product-list", { admin, product,settingRecord });
  };
  static add = async (req, res) => {
    try {
      upload(req, res, async function (err) {
        // if (req.fileValidationError) {
        //   return res.send(req.fileValidationError);
        // } else if (!req.file) {
        //   return res.send("Please upload an image");
        // } else if (err instanceof multer.MulterError) {
        //   console.log(err);
        //   return res.send(err);
        // } else if (err) {
        //   console.log(err);
        //   return res.send(err);
        // }
        const product = Product({
          image: req.files.image[0].filename,
          icon: req.files.icon[0].filename,
          name: req.body.name,
          description: req.body.description,
          baseprice: req.body.baseprice,
          addonlogoprice: req.body.addonlogoprice,
          sparecardprice: req.body.sparecardprice,
        });
        await product.save();
        return res.send({
          error: false,
          message: "Product added successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res.send("Somthing went wrong please try again later");
    }
  };
  static edit_product = async (req, res) => {
    try {
      upload(req, res, async function (err) {

        // if (req.fileValidationError) {
        //   return res.send(req.fileValidationError);
        // } else if (!req.file) {
        //   return res.send("Please upload an image");
        // } else if (err instanceof multer.MulterError) {
        //   console.log(err);
        //   return res.send(err);
        // } else if (err) {
        //   console.log(err);
        //   return res.send(err);
        // }

        const product = await Product.findOne({
          _id: req.body.editid,
        });
        await Product.findOneAndUpdate(
          {
            _id: req.body.editid,
          },
          {
            name: req.body.editname,
            description: req.body.editdescription,
            baseprice: req.body.editbaseprice,
            addonlogoprice: req.body.editaddonlogoprice,
            sparecardprice: req.body.editsparecardprice,
            image: req.files && req.files.image ? req.files.image[0].filename : product.image,
            icon: req.files && req.files.icon ? req.files.icon[0].filename : product.icon,
          }
        );
        return res.send({
          error: false,
          message: "Product updated successfully",
        });
      })
      
    } catch (error) {
      console.log(error);
      return res.status(500).send("Somthing went wrong please try again later");
    }
  };

  static delete = async (req, res) => {
    try {
      const product = await Product.findOne({
        _id: req.body.id,
      });

      await Product.deleteOne({
        _id: product.id,
      });
      fs.unlinkSync(root + "/public/uploads/product/" + product.image);

      return res.send({
        error: false,
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static list_coupon = async (req, res) => {
    const product = await Coupon.find();
    const admin = await Adminauth.find({});
    const settingRecord = await Setting.findOne({});
    return res.render("admin/coupon_list", { admin, product,settingRecord });
  };
  static add_coupon = async (req, res) => {
    try {
      const product = Coupon({
        coupon_code: (req.body.coupon_code).toUpperCase(),
        type: req.body.type,
        type_value: req.body.type_value,
        expiry_date: req.body.expiry_date,
        
      });
      await product.save();
      return res.send({
        error: false,
        message: "Coupon added successfully",
      });
    } catch (error) {
      console.log(error);
      return res.send("Somthing went wrong please try again later");
    }
  };
  static edit_product_coupon = async (req, res) => {
    try {
      const product = await Coupon.findOne({
        _id: req.body.editid,
      });
      await Coupon.findOneAndUpdate(
        {
          _id: req.body.editid,
        },
        {
          coupon_code: (req.body.coupon_code).toUpperCase(),
          type: req.body.type,
          type_value: req.body.type_value,
          expiry_date: req.body.expiry_date,
        }
      );
      return res.send({
        error: false,
        message: "Coupon updated successfully",
      });
      
    } catch (error) {
      console.log(error);
      return res.status(500).send("Somthing went wrong please try again later");
    }
  };

  static delete_coupon = async (req, res) => {
    try {
      const product = await Coupon.findOne({
        _id: req.body.id,
      });

      await Coupon.deleteOne({
        _id: product.id,
      });
      //fs.unlinkSync(root + "/public/uploads/product/" + product.image);

      return res.send({
        error: false,
        message: "Coupon deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = ProductController;
