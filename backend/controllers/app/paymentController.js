const User = require("../../models/User");
const Order = require("../../models/Order");
const Razorpay = require("razorpay");
var invNum = require("invoice-number");
const Receipt = require("../../models/Receipt");
const Appointment = require("../../models/Appointment");
const Notification = require("../../models/Notification");
const Cart = require("../../models/Cart");
const Coupon = require("../../models/Coupon");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class PaymentController {
  static order_with_rozorpay = async (req, res) => {
    try {
      const data = req.body;
      console.log(data);
      if (!data.id) {
        return res.status(400).send({
          status: 400,
          key: "id",
          message: "id is required",
        });
      }

      if (!data.amount) {
        return res.status(400).send({
          status: 400,
          key: "amount",
          message: "amount is required",
        });
      }

      let idsVals = data.id.split(",");

      let cartData = await Cart.findOne({_id:data.id});
      if(!cartData){
        return res.status(200).send({
          status: 200,
          error : true,
          message: "Cart data not found",
        });
      }

      let amt = Number(data.grandTotal)*100;
      
      const order_data = await instance.orders.create({
        amount: amt,
        currency: "INR",
      });
      console.log(order_data)

      const order = Order({
        unique_id: cartData.unique_id,
        order_id: order_data.id,
        amount: order_data.amount/100,
        currency: order_data.currency,
        discountObj: data.discountObj?JSON.stringify(data.discountObj):'',
        discount: data.discount,
        grandTotal: data.grandTotal,
        receipt_id: "12345",
        status: order_data.status,
        email: data.email,
        password: data.password,
        fullname: data.fullname,
        phone: data.phone,
        house_no: data.house_no,
        city: data.city,
        postal_code: data.postal_code,
        region: data.region,
        product: cartData.product,
        cart: JSON.stringify(cartData),
      });

      var savedorder = await order.save();

      // sending notification end
      return res.send({ order_id: order_data.id,data:savedorder });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };


  static checkout_with_rozorpay = async (req, res) => {
    try {
      const data = req.body;
      if (!data.order_id) {
        return res.status(400).send({
          status: 400,
          key: "order_id",
          message: "order_id is required",
        });
      }
      if (!data.payment_data) {
        return res.status(400).send({
          status: 400,
          key: "payment_data",
          message: "payment_data is required",
        });
      }
      if (!data.status) {
        return res.status(400).send({
          status: 400,
          key: "status",
          message: "status is required",
        });
      }

      const payment = await instance.orders.fetch(data.order_id);

      if (payment.amount_due == 0) {
        return res.status(400).send({
          status: 400,
          message: "No Payment due",
        });
      } else {
        const order = await Order.findOneAndUpdate(
          {
            order_id: data.order_id,
          },
          {
            payment_data: data.payment_data,
            status : data.status

          }
        );



        await Appointment.findOneAndUpdate(
          {
            order,
          },
          {
            status: 1,
          }
        );
      }

      // sending notification
      const notification = Notification({
        user: req.id,
        type: "Plan Purchased",
        data: {
          order_id: data.order_id,
          time: Date.now(),
        },
      });
      await notification.save();
      if (req.app.socket) req.app.socket.emit("Plan Purchased", data.order_id);
      return res.status(200).send({
        status: 200,
        message: "Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        message: "Something went wrong please try again later",
      });
    }
  };
  static update_payment_status = async (req, res) => {
    try {
      const data = req.body;
      const order = await Order.findOneAndUpdate(
        {
          order_id: data.razorpay_order_id,
        },
        {
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_order_id: data.razorpay_order_id,
          razorpay_signature: data.razorpay_signature,
          discountObj: data.discountObj?JSON.stringify(data.discountObj):'',
          discount: data.discount,
          amount: (Number(data.discount)+Number(data.grandTotal)),
          grandTotal: data.grandTotal,
          status : data.status

        }
      );
      const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
      const hashedPassword = await bcrypt.hash(order.password, salt);
      let checkUser = await User.findOne({email:order.email})
      if(checkUser){
      
        checkUser.password = hashedPassword
        checkUser.save();
      }else{
        const newuser = User({
          name: order.fullname,
          email: order.email,
          mobile_number: order.phone,
          password: hashedPassword,
          
        });
        checkUser = await newuser.save();
      }

      const orderupdate = await Order.findOneAndUpdate(
        {
          order_id: data.razorpay_order_id,
        },
        {
          user_id: checkUser._id,
        }
      );

      return res.status(200).send({
        status: 200,
        message: "Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        message: "Something went wrong please try again later",
      });
    }
  };
  static get_order_list = async (req, res) => {
    try {
      const order = await Order.find(
        {
          user_id: req.login_user._id,
        },
      );

      return res.status(200).send({
        status: 200,
        message: "Success",
        data : order
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        message: "Something went wrong please try again later",
      });
    }
  };
  static check_coupon_code = async (req, res) => {
    let msg = "Something went wrong please try again later";
    try {
      let coupon_code = (req.body.coupon_code).toUpperCase();
      let msg = "Something went wrong please try again later";
  
      if (!coupon_code) {
        return res.status(200).send({
          success : false,
          message : 'coupon_code is required'
        });
      }
     // referral_code = referral_code.toLowerCase();
   
      try {
        let user = await Coupon.findOne({
          coupon_code:coupon_code,
        });
        console.log(user)
        if (!user) {
          return res.status(200).send({
            success : false,
            message : 'Invalid coupon'
          });
        }
        else{
          return res.status(200).send({
            data : user,
            success : true,
            message : 'Success..! Coupon applied successfully'
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(401).send(msg);
      }
     
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
}

var instance = new Razorpay({
  key_id: "rzp_test_rFXwtHIILu1CTU",
  key_secret: "OagCUpxf4bDzhU7igpiUOxK2",
});

module.exports = PaymentController;
