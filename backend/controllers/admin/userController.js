const User = require("../../models/User");
const Bid = require("../../models/Bid");
const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");
const Order = require("../../models/Order");
const WalletTransactions = require("../../models/WalletTransactions");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const crypto = require("crypto");

require("dotenv");

class usersController {
  static list = async (req, res) => {
    try {
      let recordData = await User.find().sort({
        created_at: -1,
      });
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/user-list", {
        recordData,
        admin,
        settingRecord,
      });
    } catch (error) {
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static unapproved_list = async (req, res) => {
    try {
      let record = await User.find({
        approved: "false",
      }).sort({
        created_at: -1,
      });
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/unapproved_users-list", {
        record,
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

  static view = async (req, res) => {
    try {
      let userId = req.params.id;
      let record = await User.findById(userId);
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      const wallet_transactions = await WalletTransactions.find({
        user_id: userId,
        transaction_type: "credit",
      }).populate("user_id");

      const withdraw_transactions = await WalletTransactions.find({
        user_id: userId,
        transaction_type: "debit",
      }).populate("user_id");

      const bidDetails = await Bid.find({
        user_id: userId,
      }).populate("user_id market_id game_type_id");

      const all_transactions = await WalletTransactions.find({
        user_id: userId,
      }).populate("user_id ");

      const all_orders = await Order.find({
        email: record.email,
      }).populate("user_id ");
      console.log("all_orders",all_orders)

      return res.render("admin/user_details", {
        record,
        admin,
        wallet_transactions,
        withdraw_transactions,
        all_transactions,
        userId,
        bidDetails,
        settingRecord,
        all_orders,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
 

  static Approved = async (req, res) => {
    try {
      const data = req.body;

      await User.findByIdAndUpdate(data.id, {
        approved: data.approved,
      });
      ({
        type: "form_status",
        data: {
          id: User.id,
          status: data.approved ? "approved" : "disapproved",
          time: Date.now(),
        },
      });
      return res.send({
        error: false,
        message: "User status updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static add_money_to_wallet = async (req, res) => {
    const data = req.body;
    data.amount = data.amount;

    let userId = req.params.id;

    if (data && data.amount) {
      try {
        await User.findByIdAndUpdate(
          {
            _id: data.user_id,
          },
          {
            $inc: {
              wallet: Number(data.amount),
            },
          }
        );

        const transaction_id = getTransactionID();
        let transactionSave = {
          user_id: data.user_id,
          amount: Number(data.amount),
          transaction_type: "credit",
          transaction_id: transaction_id,
          source: "admin_credited",
        };
        await WalletTransactions.create(transactionSave);
        return res.status(202).send({
          success: true,
          message: "Amount credited successfully",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          success: false,
          error: true,
          message: error.message,
        });
      }
    } else {
      return res.status(202).send({
        success: true,
        message: "Amount not credited",
      });
    }
  };

  static debit_money_from_wallet = async (req, res) => {
    try {
      const data = req.body;
      let userId = req.params.id;
      if (!data.amount)
        return res.status(200).send({
          status: false,
          message: "Please send amount",
        });

      let userDetailsWallet = await User.findOne({
        _id: data.user_id,
      }).select("wallet");

      let currentWalletBalance = userDetailsWallet.wallet;
      if (data.amount > currentWalletBalance)
        return res.status(200).send({
          status: false,
          message:
            "You do not have sufficient balance in your wallet to make this transaction",
        });

      await User.findByIdAndUpdate(
        {
          _id: data.user_id,
        },
        {
          $inc: {
            wallet: -Number(data.amount),
          },
        }
      );

      const transaction_id = getTransactionID();
      let transactionSave = {
        user_id: data.user_id,
        amount: Number(data.amount),
        transaction_type: "debit",
        transaction_id: transaction_id,
        source: "admin_debited",
      };
      await WalletTransactions.create(transactionSave);

      let userDetails = await User.findOne({
        _id: data.user_id,
      }).select("wallet");

      let transactions = await WalletTransactions.find({
        user_id: userId,
      }).sort({
        created_at: -1,
      });

      const returnData = {
        wallet_balance: userDetails ? userDetails.wallet : 0,
        transactions: transactions,
      };

      return res.send({
        message: "Amount debited successfully",
        success: true,
        data: returnData,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static fund_history = async (req, res) => {
    try {
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});

      const all_transactions = await WalletTransactions.find({
        source: 'admin_credited',
      }).populate("user_id ").sort({created_at:-1});

      return res.render("admin/wallet_fund_history", {
        admin,
        all_transactions,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static wallet_add_fund_list = async (req, res) => {
    try {
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      let recordData = await User.find().sort({
        created_at: -1,
      });
     

      return res.render("admin/wallet_add_fund", {
        admin,
        recordData,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

}

function getTransactionID() {
  const padTo2Digits = (num) => {
    return num.toString().padStart(2, "0");
  };
  const transaction_id = crypto.randomBytes(16).toString("hex");
  const date = new Date();
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("") +
    "-" +
    transaction_id
  );
}
module.exports = usersController;
