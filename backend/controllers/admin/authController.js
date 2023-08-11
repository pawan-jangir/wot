const Setting = require("../../models/Setting");
class AuthController {
  static login = async (req, res) => {
    const settingRecord = await Setting.findOne({});
    return res.render("admin/login",{settingRecord});
  };
}

module.exports = AuthController;
