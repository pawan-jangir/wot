const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");
const GameType = require("../../models/GameType");
const Winning = require("../../models/Winning");

class WinningController {
  static winning_history = async (req, res) => {
    try {
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      const game_types = await GameType.find();

      return res.render("admin/winning-history", {
        admin,
        game_types,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static winning_history_details = async (req, res) => {
    try {
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      let game_type_id = req.query.id;
      let winning_history = await Winning.find({
        game_type_id: game_type_id,
      }).populate("game_type_id market_id user_id");

      return res.render("admin/winning-history_details", {
        winning_history,
        admin,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
}

module.exports = WinningController;
