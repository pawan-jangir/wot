const GameType = require("../../models/GameType");
const Bid = require("../../models/Bid");
const Game = require("../../models/Game");
const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");

class BidController {
  static delhi_bid_history = async (req, res) => {
    try {
      const bid = await Bid.find({}).populate("user_id market_id game_type_id").sort({created_at:-1});

      const game_type_id = await GameType.find();
      const market_id = await Game.find({
        market_type: "Delhi",
      });
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/delhi-bid-history", {

        bid,
        admin,
        game_type_id,
        market_id,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static mumbai_bid_history = async (req, res) => {
    try {
      const bid = await Bid.find({}).populate("user_id market_id game_type_id");
      const game_type_id = await GameType.find();
      const mumbai_market_id = await Game.find({
        market_type: "Mumbai",
      });
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/mumbai_bid-history", {
        bid,
        admin,
        game_type_id,
        mumbai_market_id,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static starline_bid_history = async (req, res) => {
    try {
      const bid = await Bid.find({}).populate("user_id market_id game_type_id");
      const game_type_id = await GameType.find();
      const starline_market_id = await Game.find({
        market_type: "Starline",
      });
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/starline_bid-history", {
        bid,
        admin,
        game_type_id,
        starline_market_id,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  //  Bid history
  static search_delhi_bid = async (req, res) => {
    try {
      if (req.body.market_id == "") {
        return res.send("Delhi Market is required");
      }
      let search = req.body;
      let delhimarket = search.market_id;
      let GameNumber = search.game_type_id;
      let search_date = search.date;

      let search_delhi = delhimarket;
      let search_game_number = GameNumber;
      let filters = {}
      if(search_delhi){
        filters.market_id = search_delhi
      }
      if(search_game_number){
        filters.game_type_id = search_game_number
      }
      if(search_date){
        search_date = new Date(search_date);
        let date = new Date(search_date);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // Jan is 0, dec is 11
        var day = date.getDate();
        var dateString = day + "/" + month + "/" + year;
        filters.date = dateString
      }
      console.log(filters)
      const bid = await Bid.find(filters).populate("user_id market_id game_type_id");
      // return console.log(bid);
      return res.send(bid);
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static search_mumbai_bid = async (req, res) => {
    try {
      let search = req.body;
      let mumbai_market = search.mumbai_market_id;
      let GameNumber = search.game_type_id;

      let search_mumbai = mumbai_market;
      let search_game_number = GameNumber;

      const bid = await Bid.find({
        market_id: search_mumbai,
        game_type_id: search_game_number,
      }).populate("user_id market_id game_type_id");
      return res.send(bid);
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static search_starline_bid = async (req, res) => {
    try {
      let search = req.body;
      let starline_market = search.starline_market_id;
      let GameNumber = search.game_type_id;

      let search_mumbai = starline_market;
      let search_game_number = GameNumber;

      const bid = await Bid.find({
        market_id: search_mumbai,
        game_type_id: search_game_number,
      }).populate("user_id market_id game_type_id");
      return res.send(bid);
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  // edit bid
  static edit_delhi_bid = async (req, res) => {
    try {
      const bid = await Bid.findOne({
        _id: req.body.editid,
      });

      await Bid.findOneAndUpdate(
        {
          _id: req.body.editid,
        },
        {
          number: req.body.edit_number,
          updated_at: Date.now(),
        }
      );
      return res.send({
        error: false,
        message: "Bid Number updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Somthing went wrong please try again later");
    }
  };
  static edit_starline_bid = async (req, res) => {
    try {
      const bid = await Bid.findOne({
        _id: req.body.editid,
      });

      await Bid.findOneAndUpdate(
        {
          _id: req.body.editid,
        },
        {
          number: req.body.edit_number,
          updated_at: Date.now(),
        }
      );
      return res.send({
        error: false,
        message: "Bid Number updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Somthing went wrong please try again later");
    }
  };

  //  Delete Bid
  static delhi_delete = async (req, res) => {
    try {
      const bid = await Bid.findOne({
        _id: req.body.id,
      });
      await Bid.deleteOne({
        _id: bid.id,
      });
      return res.send({
        error: false,
        message: "Bid deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static mumbai_delete = async (req, res) => {
    try {
      const bid = await Bid.findOne({
        _id: req.body.id,
      });
      await Bid.deleteOne({
        _id: bid.id,
      });
      return res.send({
        error: false,
        message: "Bid deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static starline_delete = async (req, res) => {
    try {
      const bid = await Bid.findOne({
        _id: req.body.id,
      });
      await Bid.deleteOne({
        _id: bid.id,
      });
      return res.send({
        error: false,
        message: "Bid deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = BidController;
