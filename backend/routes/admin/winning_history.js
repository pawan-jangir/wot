const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const WinningController = require("../../controllers/admin/winningHistoryController");

router.get("/list", NotLoggedIn, WinningController.winning_history);
router.get("/details", NotLoggedIn, WinningController.winning_history_details);

module.exports = router;
