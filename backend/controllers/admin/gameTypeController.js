const GameType = require("../../models/GameType");
const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");
const multer = require("multer");
const path = require("path");
const root = process.cwd();
const imageFilter = require("../../config/imageFilter");
const fs = require("fs");
const moment = require("moment");
// Set The Storage Engine
const storage = multer.diskStorage({
  destination: path.join(root, "/public/uploads/game_type"),
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  // limits: {
  //     fileSize: 5000000
  // },
  fileFilter: imageFilter,
}).single("image");

class GameTypeController {
  static list = async (req, res) => {
    try {
      const gameType = await GameType.find();
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      res.render("admin/gameType", {
        gameType,
        admin,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  };
  static add = async (req, res) => {
    try {
      const game = await GameType.find();

      if (game.length < 7) {
        upload(req, res, async function (err) {
          if (req.fileValidationError) {
            return res.send(req.fileValidationError);
          } else if (!req.file) {
            return res.send("Please upload an image");
          } else if (err instanceof multer.MulterError) {
            console.log(err);
            return res.send(err);
          } else if (err) {
            console.log(err);
            return res.send(err);
          }
          const slider = GameType({
            image: req.file.filename,
            type: (req.body.type).toUpperCase(),
            order: req.body.order,
          });
          await slider.save();
          return res.send({
            error: false,
            message: "Game Type added successfully",
          });
        });
        // const gameType = new GameType(req.body);
        // await gameType.save();

        // return res.status(200).json({
        //   message: "Game Type added successfully",
        //   success: true,
        //   status: 200,
        // });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  };
  static edit = async (req, res) => {
    try {
      console.log(req.body)
      const game = await GameType.find();
      upload(req, res, async function (err) {
        console.log(req.body)
        if (req.fileValidationError) {
          return res.send(req.fileValidationError);
        }  else if (err instanceof multer.MulterError) {
          console.log(err);
          return res.send(err);
        } else if (err) {
          console.log(err);
          return res.send(err);
        }
        let updateObj = {
          type: (req.body.type).toUpperCase(),
          order: req.body.order,
        }
        if(req.file){
          updateObj.image = req.file.filename
        }
        await GameType.findOneAndUpdate({_id:req.body.record_id},updateObj)
        
        return res.send({
          error: false,
          message: "Game Type updated successfully",
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  };
  static delete = async (req, res) => {
    try {
      const gameType = await GameType.find({
        _id: req.body.id,
      });
      await gameType[0].remove();
      return res.status(200).json({
        message: "Game Type deleted successfully",
        status: 200,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong",
        status: 500,
        success: false,
      });
    }
  };
}

module.exports = GameTypeController;
