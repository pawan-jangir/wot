const Game = require("../../models/Game");
const Bid = require("../../models/Bid");
const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");
const Result = require("../../models/Result");
const GameType = require("../../models/GameType");
const User = require("../../models/User");
const ObjectId = require("mongoose").Types.ObjectId;
const Winning = require("../../models/Winning");

class ResultController {
  static result = async (req, res) => {
    try {
      const game_type_id = await GameType.find();
      const admin = await Adminauth.find({});
      let date = req.query.date ? req.query.date  : getTodayDateInString();
      const settingRecord = await Setting.findOne({});
      let filterCond = {
        date : date
      }
      const result = await Result.find(filterCond).populate("market_id").sort({created_stamp:-1});
      const market_id = await Game.find({});

      // return console.log(market_id);
      return res.render("admin/result", {
        game_type_id,
        market_id,
        admin,
        result,
        settingRecord,
        date,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static save_result = async (req, res) => {
    try {
      let market_id = req.body.market_id;
      let market_session = req.body.market_session;
      let digit = req.body.digit;
      let result_number = req.body.result_number;
      let date = new Date(req.body.date);

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let ondate = day + "/" + month + "/" + year;

      let todayDate = new Date();
      let dayToday = todayDate.getDate();
      let monthToday = todayDate.getMonth() + 1;
      let yearToday = todayDate.getFullYear();
      let ondateToday = dayToday + "/" + monthToday + "/" + yearToday;
      // return console.log(ondate);
      if(ondate != ondateToday){
        return res.send({
          error: true,
          message: "Only today's dates is allowed to declare result.",
        });
      }
     
      let marketN = await Game.findOne({
        _id: market_id,
      });

      if (!marketN) {
        return res.send("Please select market name");
      }
      let myObj = {
        market_id: market_id,
        date: ondate,
        
      }
      let updateObj = {
        market_id: market_id,
        date: ondate,
        result_number: digit,
        created_stamp : new Date().getTime()
      }
      if(market_session == 'open' && digit){
        updateObj.open_pana = {
          result_number : digit,
          digit : result_number,
          text_value : digit+'-'+result_number,
          // declare_date : new Date(),
          // declare_date_timestamp : new Date().getTime()
        }
      }
      if(market_session == 'close' && digit){
        updateObj.close_pana = {
          result_number : digit,
          digit : result_number,
          text_value : result_number+'-'+digit,
          // declare_date : new Date(),
          // declare_date_timestamp : new Date().getTime()
        }
      }
      
      console.log(myObj)
      let updateOrSave = await Result.findOneAndUpdate(
        myObj,
        updateObj,
        {upsert: true, new: true},
      );

      return res.send({
        error: false,
        data: updateOrSave,
        message: "Result added successfully",
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static result_declare_old = async (req, res) => {
    try {
      let game_type = req.body.game_type_id;
      let market_id = req.body.market_id;
      let date = new Date(req.body.date);

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      let ondate = day + "/" + month + "/" + year;
      // return console.log(ondate);

      let result_number = req.body.result_number;
      if (game_type == " ") {
        return res.send("Please select game number");
      }

      const game_types = await GameType.findOne({
        _id: game_type,
      });

      if (!game_types) {
        return res.send("Please select game Type");
      }

      let marketN = await Game.findOne({
        _id: market_id,
      });

      if (!marketN) {
        return res.send("Please select market name");
      }

      let bid = await Bid.find({
        game_type_id: game_types._id,
        number: result_number,
        market_id: marketN._id,
        date: ondate,
      }).populate("game_type_id user_id market_id");

      // return console.log(bid);

      let bid_amount = bid.map((item) => item.amount);

      let bid_amount_0 = 0;
      let user_id = bid.map((item) => item.user_id._id);
      if (game_types.type == "SINGLE DIGIT") {
        bid_amount_0 = bid_amount.map((item) => item * 10);
      } else if (game_types.type == "JODI DIGIT") {
        bid_amount_0 = bid_amount.map((item) => item * 95);
      } else if (game_types.type == "SINGLE PANA") {
        bid_amount_0 = bid_amount.map((item) => item * 150);
      } else if (game_types.type == "DOUBLE PANA") {
        bid_amount_0 = bid_amount.map((item) => item * 300);
      } else if (game_types.type == "TRIPLE PANA") {
        bid_amount_0 = bid_amount.map((item) => item * 700);
      } else if (game_types.type == "HALF SANGAM") {
        bid_amount_0 = bid_amount.map((item) => item * 1000);
      } else if (game_types.type == "FULL SANGAM") {
        bid_amount_0 = bid_amount.map((item) => item * 10000);
      }

      for (let i = 0; i < bid.length; i++) {
        const user = await User.findOne({
          _id: user_id[i],
        });
        await User.findOneAndUpdate(
          {
            _id: user_id[i],
          },
          {
            $set: {
              wallet: user.wallet + bid_amount_0[i],
            },
          }
        );

        const winnings = new Winning({
          user_id: user_id[i],
          game_type_id: game_type,
          market_id: marketN._id,
          winning_amount: bid_amount_0[i],
        });
        await winnings.save();
      }

      const results = Result({
        game_type_id: game_type,
        market_id: market_id,
        date: ondate,
        result_number: req.body.result_number,
      }).populate("game_type_id market_id");

      await results.save();

      return res.send({
        error: false,
        message: "Result added successfully",
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static show_winners = async (req, res) => {
    try {
      let result_id = req.body.result_id;
      let game_type = req.body.game_type_id;
      let market_id = req.body.market_id;
      let date = new Date(req.body.date);
      let result = await Result.findOne({_id:result_id}).lean();
      result.digit = req.body.digit
      result.result_number = req.body.result_number
      result.market_session = req.body.market_session

      let sesstionTypes = [];
      let generalResultNoConstions = [];
      if(result.result_number){
        generalResultNoConstions.push(Number(result.result_number))
      }
      if(result.digit){
        generalResultNoConstions.push(Number(result.digit))
      }
      let findCond = {
        market_id: result.market_id,
        date: result.date,
      }
      if(result.market_session == 'open'){
        sesstionTypes.push('open');
      }
      let opnSum = 0
      let closeSum = 0
      let jodiNumber = 0

      if(result.market_session == 'close'){
        sesstionTypes.push('close')
        let openData = result.open_pana && result.open_pana.result_number ? result.open_pana.result_number.split('') : [];
        let closeData = result.close_pana && result.close_pana.result_number ? result.close_pana.result_number.split('') : [];

        for(let i = 0; i< openData.length; i++){
          opnSum += Number(openData[i]);
        }
        for(let i = 0; i< closeData.length; i++){
          closeSum += Number(closeData[i]);
        }
        if(opnSum > 9){
          opnSum = String(String(opnSum).split('')[(String(opnSum).split('')).length-1]);
        }
        if(closeSum > 9){
          closeSum = String(String(closeSum).split('')[(String(closeSum).split('')).length-1]);
        }
        jodiNumber = String(opnSum)+String(closeSum);
        // console.log("opnSum",opnSum)
        // console.log("closeSum",closeSum)
        // console.log("jodiNumber",jodiNumber)
      }
      if(sesstionTypes.length){
        findCond.session  = {$in:sesstionTypes}
      }
      findCond.number  = {$in:generalResultNoConstions}
      if(jodiNumber != 0 && result.market_session == 'close'){
        delete findCond.session;
        delete findCond.number;
        findCond['$or'] = [
          {
            $and : [
              {
                session :{$in:sesstionTypes},
                number :{$in:generalResultNoConstions},
              }
            ]
          },
          {
            $and : [
              {
                session :{$in:['open','close']},
                number :{$in:[jodiNumber]},
              }
            ]
          }
        ]
      }
      
      console.log("generalResultNoConstions",generalResultNoConstions)
      console.log("findCond",JSON.stringify(findCond))
      let bid = await Bid.find(findCond).populate("game_type_id user_id market_id").lean();
      let totalBidAmount = 0
      let totalWinningAmount = 0
      for(let i = 0; i< bid.length; i++){
        if (bid[i].game_type_id.type == "SINGLE DIGIT") {
          bid[i].winning_amount = bid[i].amount*10;
        } else if (bid[i].game_type_id.type == "JODI DIGIT") {
          bid[i].winning_amount = bid[i].amount*95;
        } else if (bid[i].game_type_id.type == "SINGLE PANA") {
          bid[i].winning_amount = bid[i].amount*150;
        } else if (bid[i].game_type_id.type == "DOUBLE PANA") {
          bid[i].winning_amount = bid[i].amount*300;
        } else if (bid[i].game_type_id.type == "TRIPLE PANA") {
          bid[i].winning_amount = bid[i].amount*700;
        } else if (bid[i].game_type_id.type == "HALF SANGAM") {
          bid[i].winning_amount = bid[i].amount*1000;
        } else if (bid[i].game_type_id.type == "FULL SANGAM") {
          bid[i].winning_amount = bid[i].amount*10000;
        }
        totalWinningAmount += bid[i].winning_amount;
        totalBidAmount += bid[i].amount;
      }
      console.log("bid",bid)
      // return console.log(bid);
      return res.send({
        error: false,
        message: "Success",
        data: bid,
        totalBidAmount: totalBidAmount,
        totalWinningAmount: totalWinningAmount,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static declare_result = async (req, res) => {
    try {
      let currentDate = getTodayDateInString();
      let result_id = req.body.result_id;
      let game_type = req.body.game_type_id;
      let market_id = req.body.market_id;
      let date = new Date(req.body.date);
      let result = await Result.findOne({_id:result_id}).lean();
      // console.log("result",result)
      // console.log("resul33333333t",(!result.open_pana && !result.close_pana))
      // if(result && (!result.open_pana || !result.close_pana)){
      //   if(!result.open_pana){
      //     return res.send({
      //       error: true,
      //       message: "Please save open pana result first",
      //     });
      //   }
      //   if(!result.close_pana){
      //     return res.send({
      //       error: true,
      //       message: "Please save close pana result first",
      //     });
      //   }
        
      // }

      if((result && result.open_pana && result.open_pana.result_number != '' && result.close_pana && result.close_pana.result_number != '') && result.date == currentDate){
        return res.send({
          error: true,
          message: "Result is already declared for today",
        });
      }
      result.digit = req.body.digit
      result.result_number = req.body.result_number
      result.market_session = req.body.market_session

      if(req.body.market_session == 'close' && (!result.open_pana || !result.open_pana.declare_date_timestamp)){
        return res.send({
          error: true,
          message: "Please declare open market result first",
        });
      }

      let sesstionTypes = [];
      let generalResultNoConstions = [];
      if(result.result_number){
        generalResultNoConstions.push(Number(result.result_number))
      }
      if(result.digit){
        generalResultNoConstions.push(Number(result.digit))
      }
      let findCond = {
        market_id: result.market_id,
        date: result.date,
      }
      if(result.market_session == 'open'){
        sesstionTypes.push('open');
      }
      let opnSum = 0
      let closeSum = 0
      let jodiNumber = 0

      if(result.market_session == 'close'){
        sesstionTypes.push('close')
        let openData = result.open_pana && result.open_pana.result_number ? result.open_pana.result_number.split('') : [];
        let closeData = result.close_pana && result.close_pana.result_number ? result.close_pana.result_number.split('') : [];

        for(let i = 0; i< openData.length; i++){
          opnSum += Number(openData[i]);
        }
        for(let i = 0; i< closeData.length; i++){
          closeSum += Number(closeData[i]);
        }
        if(opnSum > 9){
          opnSum = String(String(opnSum).split('')[(String(opnSum).split('')).length-1]);
        }
        if(closeSum > 9){
          closeSum = String(String(closeSum).split('')[(String(closeSum).split('')).length-1]);
        }
        jodiNumber = String(opnSum)+String(closeSum);
        // console.log("opnSum",opnSum)
        // console.log("closeSum",closeSum)
        // console.log("jodiNumber",jodiNumber)
      }
      if(sesstionTypes.length){
        findCond.session  = {$in:sesstionTypes}
      }
      findCond.number  = {$in:generalResultNoConstions}
      if(jodiNumber != 0 && result.market_session == 'close'){
        delete findCond.session;
        delete findCond.number;
        findCond['$or'] = [
          {
            $and : [
              {
                session :{$in:sesstionTypes},
                number :{$in:generalResultNoConstions},
              }
            ]
          },
          {
            $and : [
              {
                session :{$in:['open','close']},
                number :{$in:[jodiNumber]},
              }
            ]
          }
        ]
      }

      //declare result
      let updateObject = {}
      if(result.market_session == 'close'){
        updateObject.close_pana = {
          result_number : (result.result_number ? result.result_number : null),
          digit : (result.digit ? result.digit : null),
          text_value : (result.close_pana && result.close_pana.text_value ? result.close_pana.text_value : ''),
          declare_date : new Date(),
          declare_date_timestamp : new Date().getTime(),
          is_result_declared : 1,
        }
      }
      if(result.market_session == 'open'){
        updateObject.open_pana = {
          result_number : (result.result_number ? result.result_number : null),
          digit : (result.digit ? result.digit : null),
          text_value : (result.open_pana && result.open_pana.text_value ? result.open_pana.text_value : ''),
          declare_date : new Date(),
          declare_date_timestamp : new Date().getTime(),
          is_result_declared : 1,
        }
      }
      let latestRes = await Result.findOneAndUpdate({_id:result_id},updateObject,{upsert: true, new: true},);

      console.log("latestRes",latestRes)
      console.log("generalResultNoConstions",generalResultNoConstions)
      console.log("findCond",JSON.stringify(findCond))
      let bid = await Bid.find(findCond).populate("game_type_id user_id market_id").lean();
      let totalBidAmount = 0
      let totalWinningAmount = 0
      for(let i = 0; i< bid.length; i++){
        if (bid[i].game_type_id.type == "SINGLE DIGIT") {
          bid[i].winning_amount = bid[i].amount*10;
        } else if (bid[i].game_type_id.type == "JODI DIGIT") {
          bid[i].winning_amount = bid[i].amount*95;
        } else if (bid[i].game_type_id.type == "SINGLE PANA") {
          bid[i].winning_amount = bid[i].amount*150;
        } else if (bid[i].game_type_id.type == "DOUBLE PANA") {
          bid[i].winning_amount = bid[i].amount*300;
        } else if (bid[i].game_type_id.type == "TRIPLE PANA") {
          bid[i].winning_amount = bid[i].amount*700;
        } else if (bid[i].game_type_id.type == "HALF SANGAM") {
          bid[i].winning_amount = bid[i].amount*1000;
        } else if (bid[i].game_type_id.type == "FULL SANGAM") {
          bid[i].winning_amount = bid[i].amount*10000;
        }
        totalWinningAmount += bid[i].winning_amount;
        totalBidAmount += bid[i].amount;

        await User.findOneAndUpdate(
          {
            _id: bid[i].user_id._id,
          },
          {
            $inc: {
              wallet: bid[i].winning_amount
            }
          }
        );

        const winnings = new Winning({
          user_id: bid[i].user_id._id,
          game_type_id: bid[i].game_type_id._id,
          market_id: bid[i].market_id._id,
          winning_amount: bid[i].winning_amount,
        });
        await winnings.save();

      }

      console.log("bid",bid)
      // return console.log(bid);
      return res.send({
        error: false,
        message: "Success, Result has been declared successfully",
        data: bid,
        totalBidAmount: totalBidAmount,
        totalWinningAmount: totalWinningAmount,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static resultEdit = async (req, res) => {
    try {
      const result = await Result.findOne({
        _id: req.body.editid,
      });
      await Result.findOneAndUpdate(
        {
          _id: req.body.editid,
        },
        {
          game_type_id: req.body.edit_game_type_id,
          date: req.body.edit_date,
          result: req.body.edit_result,
          updated_at: Date.now(),
        }
      );
      return res.send({
        error: false,
        message: "Result updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Somthing went wrong please try again later");
    }
  };

  static resultDelete = async (req, res) => {
    try {
      const result = await Result.findOne({
        _id: req.body.id,
      });
      let updateObj = {}
      if(req.body.type == 'open_pana'){
        updateObj.open_pana = {}
      }
      if(req.body.type == 'close_pana'){
        updateObj.close_pana = {}
      }
      await Result.findOneAndUpdate({
        _id: result.id,
      },updateObj);
      return res.send({
        error: false,
        message: "Result deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}
function convertTimeToDate(time) {
  let date = new Date();
  let timeString = time + ":00";

  var year = date.getFullYear();
  var month = date.getMonth() + 1; // Jan is 0, dec is 11
  var day = date.getDate();
  var dateString = "" + year + "-" + month + "-" + day;
  var combined = new Date(dateString + " " + timeString).getTime();

  return combined;
}
function getTodayDateInString() {
  let date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // Jan is 0, dec is 11
  var day = date.getDate();
  var dateString = day + "/" + month + "/" + year;
  return dateString;
}
module.exports = ResultController;
