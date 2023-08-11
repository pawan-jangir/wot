const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const MumbaiGameController = require("../../controllers/admin/mumbaiGameController");

router.get("/list", NotLoggedIn, MumbaiGameController.list);
router.get("/bid_date_wise", NotLoggedIn, MumbaiGameController.bid_date_wise);
router.post("/add", NotLoggedIn, MumbaiGameController.gamePOST);
router.post("/edit", NotLoggedIn, MumbaiGameController.edit_game);
router.post("/delete", NotLoggedIn, MumbaiGameController.delete);
router.post(
  "/mumbai_search",
  NotLoggedIn,
  MumbaiGameController.date_wise_search
);

module.exports = router;
