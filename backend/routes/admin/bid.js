const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const BidController = require("../../controllers/admin/bidController");

router.get("/delhi-list", NotLoggedIn, BidController.delhi_bid_history);
router.get("/mumbai-list", NotLoggedIn, BidController.mumbai_bid_history);
router.get("/starline-list", NotLoggedIn, BidController.starline_bid_history);

router.post("/delhi", NotLoggedIn, BidController.search_delhi_bid);
router.post("/delhi-edit", NotLoggedIn, BidController.edit_delhi_bid);
router.post("/mumbai", NotLoggedIn, BidController.search_mumbai_bid);
router.post("/starline", NotLoggedIn, BidController.search_starline_bid);
router.post("/starline-edit", NotLoggedIn, BidController.edit_starline_bid);

router.post("/delhi-delete", NotLoggedIn, BidController.delhi_delete);
router.post("/mumbai-delete", NotLoggedIn, BidController.mumbai_delete);
router.post("/starline-delete", NotLoggedIn, BidController.starline_delete);

module.exports = router;
