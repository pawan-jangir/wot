const Support = require("../../models/Support");
const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");

class SupportController {
  static supportGET = async (req, res) => {
    try {
      const data = await Support.findOne({});
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/support", {
        content: data ? data.content : "",
        admin,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static supportPOST = async (req, res) => {
    try {
      let data = req.body;
      var exist = await Support.findOne();
      if (exist) {
        const data = req.body;
        await Support.findOneAndUpdate(
          {},
          {
            content: data.content.trim(),
            updated_at: Date.now(),
          }
        );
      } else {
        const data = req.body;
        const support = await Support({
          content: data.content.trim(),
        });

        await support.save();
      }
      return res.send({
        error: false,
        message: "Support updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = SupportController;
