const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const SupportController = require("../../controllers/admin/supportController");

router.get("/support", NotLoggedIn, SupportController.supportGET);
router.post("/support", NotLoggedIn, SupportController.supportPOST);

module.exports = router;
