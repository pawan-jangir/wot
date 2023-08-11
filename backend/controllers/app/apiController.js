const About = require("../../models/About");
const User = require("../../models/User");
const Contact = require("../../models/Contact");
const Faq = require("../../models/Faq");
const PrivacyPolicy = require("../../models/PrivacyPolicy");
const Slider = require("../../models/Slider");
const TermsCondition = require("../../models/TermsCondition");
const Game = require("../../models/Game");
const Bid = require("../../models/Bid");
const GameType = require("../../models/GameType");
const WalletTransactions = require("../../models/WalletTransactions");
const Setting = require("../../models/Setting");
const uuid = require("uuid");
const crypto = require("crypto");
const baseURL = process.env.URL;
var ObjectId = require("mongodb").ObjectID;
const Product = require("../../models/Product");
const Cart = require("../../models/Cart");

const Result = require("../../models/Result");
const Winning = require("../../models/Winning");
const jwt = require("jsonwebtoken");


const multer = require("multer");
const path = require("path");
const root = process.cwd();
const imageFilter = require("../../config/imageFilter");
const fs = require("fs");

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
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/cart"),
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  },
});
const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  //fileFilter: imageFilter,
}).fields([
  {
    name: "companyLogo",
    maxCount: 1,
  },
  {
    name: "selectedColor",
    maxCount: 1,
  },
]);

class ApiController {
  static users = async (req, res) => {
    try {
      const data = await User.find({});
      return res.send(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static about = async (req, res) => {
    try {
      const data = await About.find({});
      return res.send(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static contact = async (req, res) => {
    try {
      const data = await Contact.find({});
      return res.send(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static faq = async (req, res) => {
    try {
      const data = await Faq.find();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static products = async (req, res) => {
    try {
      const data = await Product.find().sort({createdAt:1});
      return res.status(200).json({
        message: "success",
        status: 200,
        success: true,
        data: data,
        img_url:baseURL+'/uploads/product/'
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static privacypolicy = async (req, res) => {
    try {
      const data = await PrivacyPolicy.find({});
      return res.send(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static slider = async (req, res) => {
    try {
      const sliders = await Slider.find();
      return res.status(200).send(sliders);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static termscondition = async (req, res) => {
    try {
      const data = await TermsCondition.find({});
      return res.send(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static games_list = async (req, res) => {
    try {
		console.log(12121)
      const games = await Game.find({});
      const result = await Result.find({}).lean()
        .populate("game_type_id market_id");
        let login_user = req.login_user;
        let message = "";
        if(login_user && !login_user.approved){
          message = "Your account is deactivated, Please contact administrative."
        }
        let matchCondition = {

        }
        let gameData = await Game.aggregate(
          [
            {
              $lookup: {
                from: "results",
                let: {
                  market_id: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: { $and: [{ $eq: ["$market_id", "$$market_id"] }] },
                    },
                  },
                  {"$sort":{"created_at":-1}}
                ],
                as: "results",
              },
            },
            //{ "$unwind": {
            //  "path": "$results",
            //  "preserveNullAndEmptyArrays": true
            //} },
            { $project : { market_name: 1,market_type:1, open_time: 1, close_time: 1, status: 1, created_at: 1, updated_at: 1,results : 1} },
            { $sort : { created_at : -1 } },
            {$match:matchCondition}
           ]
        ).allowDiskUse(true).exec()
		let finalGameData = [];
		for(let i = 0; i<gameData.length; i++){
			let gameObj = gameData[i]
			if(gameData[i].results && gameData[i].results.length){
				gameObj.results = gameData[i].results[0];
			}else{
				gameObj.results = null;
			}
			finalGameData.push(gameObj);
		}
        console.log(finalGameData)

      let returnData = {
        games: finalGameData,
        //result: result,
        success: true,
        approved: login_user.approved,
        message: message,
      };
      return res.send(returnData);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  

  static delhi_game = async (req, res) => {
    try {
      const data = await Game.find({
        market_type: "Delhi",
      }).sort({created_at:-1});
      return res.send(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static mumbai_game = async (req, res) => {
    try {
      const data = await Game.find({
        market_type: "Mumbai",
      }).sort({created_at:-1});
      return res.send(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static starline_game = async (req, res) => {
    try {
      const data = await Game.find({
        market_type: "Starline",
      }).sort({created_at:-1});
      return res.send(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static game_types = async (req, res) => {
    try {
      const data = await GameType.find({}).sort({order:1});
      return res.send(data);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static get_user_wallet_details = async (req, res) => {
    try {
      const data = req.body;
      const login_user = req.login_user;
      console.log(login_user);
      let userDetails = await User.findOne({
        _id: login_user._id,
      }).select("wallet");

      let matchCond = {
        user_id: login_user._id,
      }
      let filter_date = req.body.filter_date;
      let filterDate = new Date(filter_date);
      let filterStartDate = new Date(filterDate.setHours(0, 0, 0));
      let filterEndDate = new Date(filterDate.setHours(23, 59, 59));
      if(filter_date){
        matchCond.createdAt = {$gte:filterStartDate,$lte:filterEndDate}
      }

      let transactions = await WalletTransactions.find(matchCond)
        .sort({
          created_at: -1,
        })
        .populate("user_id");
      const returnData = {
        wallet_balance: userDetails ? userDetails.wallet : 0,
        transactions: transactions,
      };

      return res.send({
        message: "success",
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
  static add_money_to_wallet = async (req, res) => {
    try {
      const data = req.body;
      const login_user = req.login_user;
      if (!data.amount)
        return res.status(200).send({
          status: false,
          message: "Please send amount",
        });

      if (!data.source)
        return res.status(200).send({
          status: false,
          message: "Please send source",
        });

      await User.findByIdAndUpdate(login_user._id, {
        $inc: {
          wallet: Number(data.amount),
        },
      });

      const transaction_id = getTransactionID();
      let transactionSave = {
        user_id: login_user._id,
        amount: Number(data.amount),
        transaction_type: "credit",
        transaction_id: transaction_id,
        source: data.source,
      };
      let saved = await WalletTransactions.create(transactionSave);
      console.log("saved",saved)

      let userDetails = await User.findOne({
        _id: login_user._id,
      }).select("wallet");
      let transactions = await WalletTransactions.find({
        user_id: login_user._id,
      }).sort({
        created_at: -1,
      });
      const returnData = {
        wallet_balance: userDetails ? userDetails.wallet : 0,
        transactions: transactions,
      };

      return res.send({
        message: "Amount credited successfully",
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
  static credit_requests_list = async (req, res) => {
    let msg = "Something went wrong please try again later";
    try {
      const sliders = await WalletTransactions.find({
        user_id: req.login_user._id,
        transaction_type: "credit",
        source: "credit",
      }).sort({
        created_at: -1,
      });

      let returnObj = {
        data: sliders,
        message: "success",
        status: true,
      };
      return res.send(returnObj);
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static credit_request_generate = async (req, res) => {
    try {
      const data = req.body;
      const login_user = req.login_user;

      if (!data.amount)
        return res
          .status(200)
          .send({ status: false, message: "Please send amount" });

      let userDetailsWallet = await User.findOne({
        _id: login_user._id,
      });

      let currentWalletBalance = userDetailsWallet.wallet;

      await User.findByIdAndUpdate(login_user._id, {
        $inc: { wallet: Number(data.amount) },
      });

      const transaction_id = getTransactionID();
      let transactionSave = {
        user_id: login_user._id,
        amount: Number(data.amount),
        transaction_type: "credit",
        transaction_id: transaction_id,
        source: "credit",
        status: 1,
      };
      await WalletTransactions.create(transactionSave);

      let userDetails = await User.findOne({
        _id: login_user._id,
      }).select("wallet");
      let transactions = await WalletTransactions.find({
        user_id: login_user._id,
      }).sort({ created_at: -1 });
      const returnData = {
        wallet_balance: userDetails ? userDetails.wallet : 0,
        transactions: transactions,
      };

      return res.send({
        message: "Amount Credit successfully & in progress",
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
  static debit_money_from_wallet = async (req, res) => {
    try {
      const data = req.body;
      const login_user = req.login_user;
      if (!data.amount)
        return res.status(200).send({
          status: false,
          message: "Please send amount",
        });

      if (!data.source)
        return res.status(200).send({
          status: false,
          message: "Please send source",
      });
      if (
        !login_user.bank_name &&
        !login_user.account_number &&
        !login_user.ifsc_code
      ) {
        return res.status(200).send({
          status: false,
          message: "Bank details not completed for your account.",
        });
      }
      
      let userDetailsWallet = await User.findOne({
        _id: login_user._id,
      }).select("wallet");
      let currentWalletBalance = userDetailsWallet.wallet;
      if (data.amount > currentWalletBalance)
        return res.status(200).send({
          status: false,
          message:
            "You do not have sufficient balance in your wallet to make this transaction",
        });

      await User.findByIdAndUpdate(login_user._id, {
        $inc: {
          wallet: -Number(data.amount),
        },
      });

      const transaction_id = getTransactionID();
      let transactionSave = {
        user_id: login_user._id,
        amount: Number(data.amount),
        transaction_type: "debit",
        transaction_id: transaction_id,
        source: data.source,
        bank_name: login_user.bank_name ? login_user.bank_name : '',
        account_number: login_user.account_number ? login_user.account_number : '',
        ifsc_code: login_user.ifsc_code ? login_user.ifsc_code : '',
      };
      await WalletTransactions.create(transactionSave);

      let userDetails = await User.findOne({
        _id: login_user._id,
      }).select("wallet");
      let transactions = await WalletTransactions.find({
        user_id: login_user._id,
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
  static withdrawl_requests_list = async (req, res) => {
    let msg = "Something went wrong please try again later";
    try {
      const sliders = await WalletTransactions.find({
        user_id: req.login_user._id,
        transaction_type: "debit",
        source: "withdrawl",
      }).sort({
        created_at: -1,
      });

      let returnObj = {
        data: sliders,
        message: "success",
        status: true,
      };
      return res.send(returnObj);
    } catch (error) {
      console.log(error);
      return res.status(401).send(msg);
    }
  };
  static withdrawl_request_generate = async (req, res) => {
    try {
      const data = req.body;
      const login_user = req.login_user;
      if (!data.amount)
        return res
          .status(200)
          .send({ status: false, message: "Please send amount" });

      if (
        !login_user.bank_name &&
        !login_user.account_number &&
        !login_user.ifsc_code
      ) {
        return res.status(200).send({
          status: false,
          message: "Bank details not completed for your account.",
        });
      }

      let userDetailsWallet = await User.findOne({
        _id: login_user._id,
      });

      let currentWalletBalance = userDetailsWallet.wallet;
      if (data.amount > currentWalletBalance)
        return res.status(200).send({
          status: false,
          message:
            "You do not have sufficient balance in your wallet to make this transaction",
        });

      await User.findByIdAndUpdate(login_user._id, {
        $inc: { wallet: -Number(data.amount) },
      });

      const transaction_id = getTransactionID();
      let transactionSave = {
        user_id: login_user._id,
        amount: Number(data.amount),
        transaction_type: "debit",
        transaction_id: transaction_id,
        source: "withdrawl",
        status: 1,
        bank_name: userDetailsWallet.bank_name,
        account_number: userDetailsWallet.account_number,
        ifsc_code: userDetailsWallet.ifsc_code,
      };
      await WalletTransactions.create(transactionSave);

      let userDetails = await User.findOne({
        _id: login_user._id,
      }).select("wallet");
      let transactions = await WalletTransactions.find({
        user_id: login_user._id,
      }).sort({ created_at: -1 });
      const returnData = {
        wallet_balance: userDetails ? userDetails.wallet : 0,
        transactions: transactions,
      };

      return res.send({
        message: "Amount withdrawl successfully & in progress",
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

  static user_bid_create = async (req, res) => {
    try {
      const data = req.body;
      let game = data.market_id;
      let session = data.session;
	  console.log("req.body",req.body)

      var market = await Game.findOne({
        _id: data.market_id,
      });

      if (!market) {
        return res.status(500).send({
          message: "Market not found",
          status: false,
        });
      }

      var market_time = market.close_time;
      let currentTIme = new Date().getTime();

      let marketCloseTime = market_time;
      let convertedTimeofCloseMarket = convertTimeToDate(marketCloseTime);
      // return console.log(convertedTimeofCloseMarket)
      if (convertedTimeofCloseMarket < currentTIme) {
        return res.status(500).send({
          message: "Market is closed",
          status: false,
        });
      }

      if (!data.amount) {
        return res.status(200).send({
          status: false,
          message: "Please send amount",
        });
      }

      let login_user = req.login_user;
      let userDetailsWallet = await User.findOne({
        _id: login_user._id,
      }).select("wallet");

      if (userDetailsWallet) {
        if (data.amount > userDetailsWallet.wallet) {
          return res.status(200).send({
            status: false,
            message:
              "You do not have sufficient balance in your wallet to make this transaction",
          });
        }
      }

      await User.findByIdAndUpdate(login_user._id, {
        $inc: {
          wallet: -Number(data.amount),
        },
      });

      const transaction_id = getTransactionID();
      let transactionSave = {
        user_id: login_user._id,
        market_id: data.market_id,
        game_type_id: data.game_type_id,
        amount: Number(data.amount),
        transaction_type: "debit",
        transaction_id: transaction_id,
        source: "bid_created",
      };
      await WalletTransactions.create(transactionSave);
      let bid_create = {
        user_id: login_user._id,
        market_id: data.market_id,
        game_type_id: data.game_type_id,
        session: data.session,
        amount: Number(data.amount),
        number: data.number,
		date : getTodayDate()
      };
      await Bid.create(bid_create);

      let userDetails = await User.findOne({
        _id: login_user._id,
      }).select("wallet");
      let transactions = await WalletTransactions.find({
        user_id: login_user._id,
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

  static result = async (req, res) => {
    try {
      const result = await Result.find()
        .populate("game_type_id market_id")
        .sort({ created_at: -1 });
      return res.status(200).json({
        message: "Result fetched successfully",
        status: 200,
        success: true,
        data: result,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static market_result = async (req, res) => {
    try {
      let market_id = req.body.market_id;
      const result = await Result.find({
        market_id: req.body.market_id,
      })
        .populate("game_type_id market_id")
        .sort({ created_at: -1 });
      return res.status(200).json({
        message: "Result fetched successfully",
        status: 200,
        success: true,
        data: result,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static bid_history = async (req, res) => {
    try {
      let login_user = req.login_user;
      let matchCond = {
        user_id: login_user._id,
      }
      let filter_date = req.body.filter_date;
      let filterDate = new Date(filter_date);
      let filterStartDate = new Date(filterDate.setHours(0, 0, 0));
      let filterEndDate = new Date(filterDate.setHours(23, 59, 59));
      if(filter_date){
        matchCond.createdAt = {$gte:filterStartDate,$lte:filterEndDate}
      }
      const bid = await Bid.find(matchCond).populate("user_id game_type_id market_id").sort({created_at:-1});
      return res.status(200).json({
        message: "Bid history fetched successfully",
        status: 200,
        success: true,
        data: bid,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static winning_history = async (req, res) => {
    try {
      let token = req.body.token;
     
     
      if (token == "") return res.status(401).send("token is required");

      const payload = jwt.decode(token, process.env.TOKEN_SECRET);
      if (payload == null) return res.status(401).send("token is required");
      const user = await User.findById(payload._id);
      if (user == null) return res.status(401).send("token is required");
      let matchCond = {
        user_id: user._id,
      }
      let filter_date = req.body.filter_date;
      let filterDate = new Date(filter_date);
      let filterStartDate = new Date(filterDate.setHours(0, 0, 0));
      let filterEndDate = new Date(filterDate.setHours(23, 59, 59));
      if(filter_date){
        matchCond.createdAt = {$gte:filterStartDate,$lte:filterEndDate}
      }
      console.log(matchCond)
      const winning = await Winning.find(matchCond).populate("user_id game_type_id market_id result_id").sort({updated_at:-1});

      return res.status(200).json({
        message: "Winning history fetched successfully",
        status: 200,
        success: true,
        data: winning,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static settings = async (req, res) => {
    try {
      const settings = await Setting.find();
      return res.status(200).json({
        message: "Settings fetched successfully",
        status: 200,
        success: true,
        data: settings,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static games_result_wise = async (req, res) => {
    try {
      let search_period_start = req.body.search_period_start;
      let search_period_end = req.body.search_period_end;
      let market_id = req.body.market_id;
      if(!search_period_start){
        return res.status(401).send("search_period_start is required");
      }
      if(!search_period_end){
        return res.status(401).send("search_period_end is required");
      }
      if(!market_id){
        return res.status(401).send("market_id is required");
      }
      let startTime = new Date(search_period_start);
      let endTime = new Date(search_period_end);
        let login_user = req.login_user;
        let message = "";
        if(login_user && !login_user.approved){
          message = "Your account is deactivated, Please contact administrative."
        }
        let matchCondition = {
          _id : ObjectId(req.body.market_id)
        }
        console.log(startTime)
        console.log(endTime)
       // console.log(searchPeriodArr)
        let gameData = await Game.aggregate(
          [
            {
              $lookup: {
                from: "results",
                let: {
                  market_id: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: { $and: [
                        { $eq: ["$market_id", "$$market_id"] },
                        { $gte: ["$createdAt", startTime] },
                        { $lte: ["$createdAt", endTime] },
                      ] },

                    },
                  },
                  {"$sort":{"createdAt":-1}}
                ],
                as: "results",
              },
            },
            //{ "$unwind": {
            //  "path": "$results",
            //  "preserveNullAndEmptyArrays": true
            //} },
            { $project : { market_name: 1,market_type:1, open_time: 1, close_time: 1, status: 1, created_at: 1, updated_at: 1,results : 1} },
            { $sort : { created_at : -1 } },
            {$match:matchCondition}
           ]
        ).allowDiskUse(true).exec()
		

      let returnData = {
        games: gameData && gameData.length ? gameData[0] : null,
        //result: result,
        success: true,
        message: message,
      };
      return res.send(returnData);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  static add_cart = async (req, res) => {
    try {
      upload(req, res, async function (err) {
        let cartCheck = await Cart.findOne({unique_id:req.body.unique_id}).lean();
        if(cartCheck){
          await Cart.deleteMany({unique_id:req.body.unique_id});
        }
        const product = Cart({
          companyLogo: req.files && req.files.companyLogo &&  req.files.companyLogo[0].filename ? req.files.companyLogo[0].filename : '',
          unique_id: req.body.unique_id,
          product_id: req.body.product_id,
          amount: req.body.amount,
          cardUsrFirstName: req.body.cardUsrFirstName,
          cardUsrLastName: req.body.cardUsrLastName,
          cardNameUser: req.body.cardNameUser,
          companyName: req.body.companyName,
          cardDocument: req.files && req.files.selectedColor &&  req.files.selectedColor[0].filename ? req.files.selectedColor[0].filename : '',
          islogoAdded: req.body.islogoAdded,
          isSparePartAdded: req.body.isSparePartAdded,
          product: req.body.product,
        });
        await product.save();
        return res.send({
          error: false,
          success: true,
          message: "Cart added successfully",
        });
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static contact_us = async (req, res) => {
    try {
      const product = Contact({
        full_name: req.body.full_name,
        email: req.body.email,
        mobile_number: req.body.mobile_number,
        company_name: req.body.company_name,
      });
      await product.save();
      return res.send({
        error: false,
        success: true,
        message: "Enquiry added successfully, We will get back to you very soon",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static get_cms_page = async (req, res) => {
    try {
      let pageType = req.params.page_type;
      let data = ''
      if(pageType == 'privacy_policy'){
        data = await PrivacyPolicy.findOne();
      }
      if(pageType == 'about'){
        data = await About.findOne();
      }
      if(pageType == 'terms'){
        data = await TermsCondition.findOne();
      }
      return res.send({
        error: false,
        success: true,
        data: data,
        message: "Success",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static get_cart = async (req, res) => {
    try {
      let cartData = await Cart.findOne({unique_id:req.params.cart_id}).lean();
      return res.send({
        error: false,
        success: true,
        data: cartData,
        message: "Success",
        img_url : baseURL+'/uploads/cart/',
        product_img_url : baseURL+'/uploads/product/'
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static update_cart = async (req, res) => {
    try {
      upload(req, res, async function (err) {
        console.log(req.body)
        let cartData = await Cart.findOne({_id:req.body.id});
        if(req.body.islogoAdded){
          cartData.islogoAdded = req.body.islogoAdded
        }
        if(req.body.isSparePartAdded){
          cartData.isSparePartAdded = req.body.isSparePartAdded
        }
        if(req.body.cardUsrFirstName){
          cartData.cardUsrFirstName = req.body.cardUsrFirstName
        }
        if(req.body.cardUsrLastName){
          cartData.cardUsrLastName = req.body.cardUsrLastName
        }
        if(req.body.companyName){
          cartData.companyName = req.body.companyName
        }
        if(req.files.companyLogo){
          cartData.companyLogo = req.files.companyLogo[0].filename
        }

        cartData.save();
        return res.send({
          error: false,
          success: true,
          data: cartData,
          message: "Updated successfully",
        });
      })
      
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = ApiController;

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

function getTodayDate() {
  let date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1; // Jan is 0, dec is 11
  var day = date.getDate();
  var dateString = day + "/" + month + "/" + year;

  return dateString;
}
