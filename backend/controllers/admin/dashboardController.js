const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");
const User = require("../../models/User");
const Game = require("../../models/Game");
const Bid = require("../../models/Bid");
const WalletTransactions = require("../../models/WalletTransactions");

class DashboardController {
  static dashboard = async (req, res) => {
    try {
      const admin = await Adminauth.find();
      const settingRecord = await Setting.findOne();
      const users = await User.find().count();
      const all_requests = await WalletTransactions.find({
        transaction_type: "credit",
        source: {
          $in: ["admin_credited", "credit"],
        },
      })
        .populate("user_id")
        .sort({
          created_at: -1,
        })
        .lean();
      const unapprovedUsers = await User.find({
        approved: "false",
      }).count();

      const approvedUsers = await User.find({
        approved: "true",
      }).count();

      const delhigames = await Game.find({
        market_type: "Delhi",
      }).count();

      const mumbaigames = await Game.find({
        market_type: "Mumbai",
      }).count();

      const starlinegames = await Game.find({
        market_type: "Starline",
      }).count();
      // find delhi bid count
      let delhi_game = await Game.find({
        market_type: "Delhi",
      });
      const delhi_bid = await Bid.find({
        market_id: delhi_game.map((item) => item._id),
      }).count();

      let mumbai_game = await Game.find({
        market_type: "Mumbai",
      });
      const mumbai_bid = await Bid.find({
        market_id: mumbai_game.map((item) => item._id),
      }).count();

      let starline_game = await Game.find({
        market_type: "Starline",
      });
      const starline_bid = await Bid.find({
        market_id: starline_game.map((item) => item._id),
      }).count();

      const delhi_Amount = await Bid.find({
        market_id: delhi_game.map((item) => item._id),
      });

      let delhi_amount = 0;
      for (let i = 0; i < delhi_Amount.length; i++) {
        delhi_amount += delhi_Amount[i].amount;
      }

      const mumbai_Amount = await Bid.find({
        market_id: mumbai_game.map((item) => item._id),
      });
      let mumbai_amount = 0;
      for (let i = 0; i < mumbai_Amount.length; i++) {
        mumbai_amount += mumbai_Amount[i].amount;
      }

      const starline_Amount = await Bid.find({
        market_id: starline_game.map((item) => item._id),
      });
      let starline_amount = 0;
      for (let i = 0; i < starline_Amount.length; i++) {
        starline_amount += starline_Amount[i].amount;
      }

      const total_withdrawl_amt = await WalletTransactions.find({
        transaction_type: "debit",
        source: "withdrawl",
      });
      let total_withdrawl = 0;
      for (let i = 0; i < total_withdrawl_amt.length; i++) {
        total_withdrawl += total_withdrawl_amt[i].amount;
      }

      const pending_withdrawl_amt = await WalletTransactions.find({
        transaction_type: "debit",
        source: "withdrawl",
        status: 1,
      });
      let pending_withdrawl = 0;
      for (let i = 0; i < pending_withdrawl_amt.length; i++) {
        pending_withdrawl += pending_withdrawl_amt[i].amount;
      }

      return res.render("admin/dashboard", {
        users,
        unapprovedUsers,
        approvedUsers,
        delhigames,
        mumbaigames,
        starlinegames,
        delhi_bid,
        mumbai_bid,
        starline_bid,
        delhi_amount,
        mumbai_amount,
        starline_amount,
        total_withdrawl,
        pending_withdrawl,
        admin,
        all_requests,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
}

module.exports = DashboardController;
