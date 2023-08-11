const WalletTransactions = require("../../models/WalletTransactions");
const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");
const User = require("../../models/User");

class PaymentController {
  static list = async (req, res) => {
    try {
      const all_requests = await WalletTransactions.find({
        transaction_type: "debit",
        source: {$in:["withdrawl","bank"]},
      })
        .populate("user_id")
        .sort({
          created_at: -1,
        })
        .lean();
      const pending_requests = await WalletTransactions.find({
        transaction_type: "debit",
        source: {$in:["withdrawl","bank"]},
        status: 1,
      })
        .populate("user_id")
        .sort({
          created_at: -1,
        })
        .lean();
      const completed_requests = await WalletTransactions.find({
        transaction_type: "debit",
        source: {$in:["withdrawl","bank"]},
        status: 2,
      })
        .populate("user_id")
        .sort({
          created_at: -1,
        })
        .lean();
      const cancelled_requests = await WalletTransactions.find({
        transaction_type: "debit",
        source: {$in:["withdrawl","bank"]},
        status: 3,
      })
        .populate("user_id")
        .sort({
          created_at: -1,
        })
        .lean();
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/payment_requests", {
        all_requests,
        pending_requests,
        completed_requests,
        cancelled_requests,
        admin,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static transaction_list = async (req, res) => {
    try {
      const all_requests = await WalletTransactions.find({
        transaction_type: "credit",
        source: {
          $in: ["admin_credited", "credit","UPI"],
        },
      })
        .populate("user_id")
        .sort({
          created_at: -1,
        })
        .lean();
      const pending_requests = await WalletTransactions.find({
        transaction_type: "credit",
        source: {
          $in: ["admin_credited", "credit","UPI"],
        },
        status: 1,
      })
        .populate("user_id")
        .sort({
          created_at: -1,
        })
        .lean();
      const completed_requests = await WalletTransactions.find({
        transaction_type: "credit",
        source: {
          $in: ["admin_credited", "credit","UPI"],
        },
        status: 2,
      })
        .populate("user_id")
        .sort({
          created_at: -1,
        })
        .lean();
      const cancelled_requests = await WalletTransactions.find({
        transaction_type: "credit",
        source: {
          $in: ["admin_credited", "credit","UPI"],
        },
        status: 3,
      })
        .populate("user_id")
        .sort({
          created_at: -1,
        })
        .lean();
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/transaction", {
        all_requests,
        pending_requests,
        completed_requests,
        cancelled_requests,
        admin,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static credit_update_status = async (req, res) => {
    try {
      let status = req.body && req.body.status ? req.body.status : 1;
      let note = req.body && req.body.note ? req.body.note : "";
      const cancelled_requests = await WalletTransactions.findByIdAndUpdate(
        {
          _id: req.body.record_id,
        },
        { status: status, last_status_update_date: new Date(), note: note }
      );
      if(status == 3){
        await User.findByIdAndUpdate(cancelled_requests.user_id, {
          $inc: { wallet: -cancelled_requests.amount },
        });
        // const updateWallet = await User.findByIdAndUpdate(
        //   {
        //     _id: cancelled_requests.user_id,
        //   },
        //   {$inc : -cancelled_requests.amount}
        // );
      }
      console.log(cancelled_requests);
      return res.json({
        status: true,
        message: "Status has been updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static update_status = async (req, res) => {
    try {
      let status = req.body && req.body.status ? req.body.status : 1;
      let note = req.body && req.body.note ? req.body.note : "";
      const cancelled_requests = await WalletTransactions.findByIdAndUpdate(
        {
          _id: req.body.record_id,
        },
        { status: status, last_status_update_date: new Date(), note: note }
      );
      if(status == 3){
        await User.findByIdAndUpdate(cancelled_requests.user_id, {
          $inc: { wallet: cancelled_requests.amount },
        });
        // const updateWallet = await User.findByIdAndUpdate(
        //   {
        //     _id: cancelled_requests.user_id,
        //   },
        //   {$inc : -cancelled_requests.amount}
        // );
      }
      console.log(cancelled_requests);
      return res.json({
        status: true,
        message: "Status has been updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = PaymentController;
