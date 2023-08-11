const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const usersController = require("../../controllers/admin/userController");

router.get("/fund_history", NotLoggedIn, usersController.fund_history);
router.get("/wallet_add_fund_list", NotLoggedIn, usersController.wallet_add_fund_list);
router.post("/add-fund", NotLoggedIn, usersController.add_money_to_wallet);


module.exports = router;
