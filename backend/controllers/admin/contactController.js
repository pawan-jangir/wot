const Contact = require("../../models/Contact");
const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");

class ContactController {
  static list = async (req, res) => {
    try {
      let record = await Contact.find().sort({
        created_at: -1,
      });
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/contact", {
        record,
        admin,
        settingRecord,
      });
    } catch (error) {
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };
  static contactList = async (req, res) => {
    try {
      const contact = await Contact.find();
      const admin = await Adminauth.find({});
      const settingRecord = await Setting.findOne({});
      return res.render("admin/contact-list", { contact, admin, settingRecord, });
    } catch (error) {
      console.log(error);
      return res.send("Something went wrong please try again later");
    }
  };
  static add = async (req, res) => {
    try {
      let data = req.body;
      var exist = await Contact.findOne();
      if (exist) {
        const data = req.body;
        await Contact.findOneAndUpdate(
          {},
          {
            contact_name: data.contact_name,
            email: data.email,
            phone: data.phone,
            message: data.message,
            updated_at: Date.now(),
          }
        );
      } else {
        const data = req.body;
        // console.log(data);
        const contact = await Contact({
          contact_name: data.contact_name,
          email: data.email,
          phone: data.phone,
          message: data.message,
        });

        await contact.save();
      }
      return res.send({
        error: false,
        message: "Contact added successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send("Something went wrong please try again later");
    }
  };

  // delete control
  static delete = async (req, res) => {
    try {
      const contact = await Contact.findOne({
        _id: req.body.id,
      });

      await Contact.deleteOne({
        _id: contact.id,
      });

      return res.send({
        error: false,
        message: "Contact deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send("Something went wrong please try again");
    }
  };
}

module.exports = ContactController;
