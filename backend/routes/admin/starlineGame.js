const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const StarlineGameController = require("../../controllers/admin/starlineGameController");

router.get("/list", NotLoggedIn, StarlineGameController.list);
router.post("/add", NotLoggedIn, StarlineGameController.gamePOST);
router.post("/edit", NotLoggedIn, StarlineGameController.edit_game);
router.post("/delete", NotLoggedIn, StarlineGameController.delete);

router.get("/bid_date_wise", NotLoggedIn, StarlineGameController.bid_date_wise);
router.post(
  "/starline_search",
  NotLoggedIn,
  StarlineGameController.date_wise_search
);

module.exports = router;
