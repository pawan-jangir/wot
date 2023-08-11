const Notice = require("../../models/Notice");
const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");

class NoticeController {
  static view = async (req, res) => {
    try {
      const notification = await Notice.findOne();
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/notification", {
        title: notification ? notification.title : "",
        description: notification ? notification.description : "",
        admin,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static notice = async (req, res) => {
    try {
      //Create data
      let data = req.body;
      data.title = data.title;
      data.description = data.description;

      // console.log(data);
      const notice = Notice(data);

      //save data
      await notice.save();
      return res.send({
        error: false,
        message: "Notification Update successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = NoticeController;
