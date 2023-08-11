const Setting = require("../../models/Setting");
const Adminauth = require("../../models/Adminauth");
class SettingsController {
  static view = async (req, res) => {
    try {
      const settings = await Setting.findOne();
      // console.log(settings);
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/settings", {
        name: settings ? settings.name : "",
        email: settings ? settings.email : "",
        mobile: settings ? settings.mobile : "",
        whatsapp: settings ? settings.whatsapp : "",
        upi_id: settings ? settings.upi_id : "",
        merchant_id: settings ? settings.merchant_id : "",
        min_betting_rate: settings ? settings.min_betting_rate : "",
        min_withdrwal_rate: settings ? settings.min_withdrwal_rate : "",
        max_withdrwal_rate: settings ? settings.max_withdrwal_rate : "",
        min_deposit_rate: settings ? settings.min_deposit_rate : "",
        max_deposit_rate: settings ? settings.max_deposit_rate : "",
        minimum_transfer: settings ? settings.minimum_transfer : "",
        maximum_transfer: settings ? settings.maximum_transfer : "",
        minimum_bid_amount: settings ? settings.minimum_bid_amount : "",
        maximum_bid_amount: settings ? settings.maximum_bid_amount : "",
        welcome_bonus: settings ? settings.welcome_bonus : "",
        account_holder_name: settings ? settings.account_holder_name : "",
        account_number: settings ? settings.account_number : "",
        ifsc_code: settings ? settings.ifsc_code : "",
        app_link: settings ? settings.app_link : "",
        msg: settings ? settings.msg : "",
        home_title_1: settings ? settings.home_title_1 : "",
        home_title_2: settings ? settings.home_title_2 : "",
        upi_name: settings ? settings.upi_name : "",
        upi_payment_id: settings ? settings.upi_payment_id : "",
        upi_paytm_id: settings ? settings.upi_paytm_id : "",
        upi_phonepay_id: settings ? settings.upi_phonepay_id : "",
        upi_googlepay_id: settings ? settings.upi_googlepay_id : "",
        market_open_time: settings ? settings.market_open_time : "",
        alert_message: settings ? settings.alert_message : "",

        admin,
        settingRecord,
      });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };

  static settingsPOST = async (req, res) => {
    try {
      var exist = await Setting.findOne();
      if (exist) {
        const data = req.body;
        console.log(data);
        await Setting.findOneAndUpdate(
          {},
          {
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            whatsapp: data.whatsapp,
            upi_id: data.upi_id,
            merchant_id: data.merchant_id,
            min_betting_rate: data.min_betting_rate,
            min_withdrwal_rate: data.min_withdrwal_rate,
            max_withdrwal_rate: data.max_withdrwal_rate,
            min_deposit_rate: data.min_deposit_rate,
            max_deposit_rate: data.max_deposit_rate,
            minimum_transfer: data.minimum_transfer,
            maximum_transfer: data.maximum_transfer,
            minimum_bid_amount: data.minimum_bid_amount,
            maximum_bid_amount: data.maximum_bid_amount,
            welcome_bonus: data.welcome_bonus,
            account_holder_name: data.account_holder_name,
            account_number: data.account_number,
            ifsc_code: data.ifsc_code,
            app_link: data.app_link,
            msg: data.msg,
            home_title_1: data.home_title_1,
            home_title_2: data.home_title_2,
            upi_name: data.upi_name,
            upi_payment_id: data.upi_payment_id,
            upi_paytm_id: data.upi_paytm_id,
            upi_phonepay_id: data.upi_phonepay_id,
            upi_googlepay_id: data.upi_googlepay_id,
            market_open_time: data.market_open_time,
            alert_message: data.alert_message,
            updated_at: Date.now(),
          }
        );
      } else {
        const data = req.body;
        const setting = await Setting({
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          whatsapp: data.whatsapp,
          upi_id: data.upi_id,
          merchant_id: data.merchant_id,
          min_betting_rate: data.min_betting_rate,
          min_withdrwal_rate: data.min_withdrwal_rate,
          max_withdrwal_rate: data.max_withdrwal_rate,
          min_deposit_rate: data.min_deposit_rate,
          max_deposit_rate: data.max_deposit_rate,
          minimum_transfer: data.minimum_transfer,
          maximum_transfer: data.maximum_transfer,
          minimum_bid_amount: data.minimum_bid_amount,
          maximum_bid_amount: data.maximum_bid_amount,
          welcome_bonus: data.welcome_bonus,
          account_holder_name: data.account_holder_name,
          account_number: data.account_number,
          ifsc_code: data.ifsc_code,
          app_link: data.app_link,
          msg: data.msg,
          home_title_1: data.home_title_1,
          home_title_2: data.home_title_2,
          upi_name: data.upi_name,
          upi_payment_id: data.upi_payment_id,
          upi_paytm_id: data.upi_paytm_id,
          upi_phonepay_id: data.upi_phonepay_id,
          upi_googlepay_id: data.upi_googlepay_id,
          market_open_time: data.market_open_time,
          alert_message: data.alert_message,
        });

        await setting.save();
      }
      return res.send({
        error: false,
        message: "Settings updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
}

module.exports = SettingsController;
