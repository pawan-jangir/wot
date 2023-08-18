const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const Otp = require("../../models/Otp");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
require("dotenv");
const moment = require("moment");
const multer = require("multer");
const root = process.cwd();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const email_regex =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;


// Set The Storage Engine
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/profile"),
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

// Init Upload
const upload = multer({
  storage: storage,

  // fileFilter: imageFilter,
}).single("image");

class AuthController {
  static login = async (req, res) => {
    const email = req.body.email;
    let msg = "Something went wrong please try again later";
    if (!req.body.email) {
      return res.json({
        message: "Please enter email",
        success: false,
      });
    } else if (!req.body.password) {
      return res.json({
        message: "Please enter password",
        success: false,
      });
    }
    if (email.split('').includes('@') && !email_regex.test(email)) {
      return res.json({
        message: "Please enter valid email",
        success: false,
      });
    }

    try {
      let user = await User.findOne({  $or : [{email: email },{mobile_number: email }]}).lean();
      if (!user) {
        return res.json({
          message: "User Not Found",
          success: false,
        });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.json({
          message: "Email or Password invalid",
          success: false,
        });
      }
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.TOKEN_SECRET
      );
      user.password = null;
      return res.json({
        message: "You have successfully logged-in",
        success: true,
        data: user,
        token: token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(msg);
    }
  };

  static otp_verify = async (req, res) => {
    try {
      let mobile_number = req.body.mobile_number;
      let otp = req.body.otp;

      if (mobile_number == "") {
        return res.send("Mobile Number is required");
      } else if (otp == "") {
        return res.send("Otp is required");
      }

      const user = await User.findOne({
        mobile_number: mobile_number,
      });
      // console.log(user)
      if (!user) return res.send("User not found");

      const verify = await Otp.findOne({
        user,
      });
      let is_registered = 0;
      if (user && user.mobile_number && user.mobile_number != "") {
        is_registered = 1;
      }
      // return console.log(verify)
      if (otp == verify.otp) {
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.TOKEN_SECRET
        );
        let data = {
          token: token,
          is_registered: is_registered,
        };
        return res.status(200).json({
          message: "Otp verified successfully",
          status: 200,
          success: true,
          data: data,
        });
      }
      return res.send("Invalid Otp");
    } catch (error) {
      console.log(error);
    }
  };

  static register = async (req, res) => {
    let msg = "Something went wrong please try again later";
    try {
      var token = req.body.token;
      var registerData = req.body.registerData;
      registerData = JSON.parse(registerData);
      const payload = jwt.decode(token, process.env.TOKEN_SECRET);
      const user = await User.findById(payload._id);
      if (!user) return res.status(401).send("User not found");

      let data = await User.findByIdAndUpdate(user._id, registerData);
      let returnObj = {
        message: "Success",
        statusCode: 200,
        data: data,
      };
      // sending notification start
      const notification = Notification({
        user: req.id,
        type: "User Registered",
        data: {
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("User Registered");

      // sending notification end
      res.send(returnObj);
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };

  static profile_update = async (req, res) => {
    let msg = "Something went wrong please try again later";
    try {
      upload(req, res, async function (err) {
        var token = req.body.token;

        const payload = jwt.decode(token, process.env.TOKEN_SECRET);
        const user = await User.findById(payload._id);
        if (!user) return res.status(401).send("User not found");

        let data = {
          image: req.file ? req.file.filename : "",
          name: req.body.name ? req.body.name : "",
          email: req.body.email ? req.body.email : "",
          account_holder_name: req.body.account_holder_name
            ? req.body.account_holder_name
            : "",
          account_number: req.body.account_number
            ? req.body.account_number
            : "",
          ifsc_code: req.body.ifsc_code ? req.body.ifsc_code : "",
          bank_name: req.body.bank_name ? req.body.bank_name : "",
          branch: req.body.branch ? req.body.branch : "",
          phonePe_no: req.body.phonePe_no ? req.body.phonePe_no : "",
          googlePay_no: req.body.googlePay_no ? req.body.googlePay_no : "",
          paytm_no: req.body.paytm_no ? req.body.paytm_no : "",
        };

        let data1 = {};
        for (let i in data) {
          if (data[i] != "") {
            // data1.push({
            //     [i]: data[i]
            // });
            data1[i] = data[i]; // json object
          }
        }

        const profile = await User.findOne({
          _id: user._id,
        });
        await User.findOneAndUpdate(
          {
            _id: profile._id,
          },
          { $set: data1 }
        );

        let Data1 = await profile.save();
        // sending notification start
        const notification = Notification({
          user: req.id,
          type: "Profile Updated",
          data: {
            time: Date.now(),
          },
        });
        await notification.save();
        if (req.app.socket) req.app.socket.emit("Profile Updated");

        // sending notification end
        return res.status(201).send({
          message: "profile Update Successfully",
          status: true,
          success: true,
          data: Data1,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static get_user_profile = async (req, res) => {
    let msg = "Something went wrong please try again later";
    try {
      var token = req.body.token;

      const payload = jwt.decode(token, process.env.TOKEN_SECRET);
      const user = await User.findById(payload._id);
      if (!user) return res.status(401).send("User not found");

      res.send(user);
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
}

module.exports = AuthController;

function sendSMS(mobileNo, OTP) {
  let theUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=ciM2u8O9yCtLgVjDz6ebT1dvm5IKBnS0kFGX74frHwJEZWYoqQjpxzq2VEoidtu048hkcMl5RTQ9rC3Y&route=v3&sender_id=FTWSMS&message=${OTP}&language=english&flash=0&numbers=${mobileNo}`;
  const request = require("request");
  // console.log(theUrl);
  request(
    theUrl,
    {
      json: true,
    },
    (err, res, body) => {
      console.log(err);
      if (err) {
        return console.log(err);
      }
      return body;
    }
  );
}
