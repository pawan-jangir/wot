const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const NoticeController = require("../../controllers/admin/noticeController");

router.get("/view", NotLoggedIn, NoticeController.view);
router.post("/send", NotLoggedIn, NoticeController.notice);

module.exports = router;
