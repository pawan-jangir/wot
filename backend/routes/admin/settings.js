const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const SettingsController = require("../../controllers/admin/settingController");

router.get("/view", NotLoggedIn, SettingsController.view);
router.post("/update", NotLoggedIn, SettingsController.settingsPOST);

module.exports = router;
