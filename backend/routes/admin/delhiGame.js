const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const DelhiGameController = require("../../controllers/admin/delhiGameController");

router.get("/list", NotLoggedIn, DelhiGameController.list);

router.get("/bid_date_wise", NotLoggedIn, DelhiGameController.bid_date_wise);
router.post("/search", NotLoggedIn, DelhiGameController.date_wise_search);

router.post("/add", NotLoggedIn, DelhiGameController.gamePOST);
router.post("/edit", NotLoggedIn, DelhiGameController.edit_game);
router.post("/delete", NotLoggedIn, DelhiGameController.delete);

module.exports = router;
