const Game = require("../../models/Game");
const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");
const Bid = require("../../models/Bid");

class DelhiGameController {
  static list = async (req, res) => {
    try {
      const game = await Game.find({
        market_type: "Delhi",
      });
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/delhi-games-list", {
        game,
        admin,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static gamePOST = async (req, res) => {
    try {
      //Create data
      let data = req.body;
      // return console.log(data);
      data.market_name = data.market_name;
      data.market_type = data.market_type;
      data.open_time = data.open_time;
      data.close_time = data.close_time;
      data.status = data.status;

      const game = Game(data);
      // console.log(data);

      //save data
      await game.save();
      return res.send({
        error: false,
        message: "Game added successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static edit_game = async (req, res) => {
    try {
      const game = await Game.findOne({
        _id: req.body.editid,
      });
      // return console.log(req.body);
      await Game.findOneAndUpdate(
        {
          _id: req.body.editid,
        },
        {
          market_name: req.body.edit_market_name,
          market_type: req.body.edit_market_type,
          open_time: req.body.edit_open_time,
          close_time: req.body.edit_close_time,
          status: req.body.edit_status,
          updated_at: Date.now(),
        }
      );
      return res.send({
        error: false,
        message: "Game updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Somthing went wrong please try again later");
    }
  };

  static delete = async (req, res) => {
    try {
      const game = await Game.findOne({
        _id: req.body.id,
      });
      await Game.deleteOne({
        _id: game.id,
      });
      return res.send({
        error: false,
        message: "Game deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static bid_date_wise = async (req, res) => {
    try {
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/delhi-bid_date_wise", {
        admin,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static date_wise_search = async (req, res) => {
    try {
      const searchText = req.body.searchText;
      const searchdate = new Date(searchText);

      const day = searchdate.getDate();
      const month = searchdate.getMonth() + 1;
      const year = searchdate.getFullYear();
      const newDate = day + "/" + month + "/" + year;

      // console.log(newDate);

      let game = await Game.find({
        market_type: "Delhi",
      });

      
      let data = await Bid.find({
        market_id: game.map((item) => item._id),
        date: newDate,
      }).populate("market_id game_type_id user_id ");
      // return console.log(data);
      return res.send(data);
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
}

module.exports = DelhiGameController;
