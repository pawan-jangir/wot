const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const usersController = require("../../controllers/admin/userController");

router.get("/list", NotLoggedIn, usersController.list);
router.get("/unapprovd_list", NotLoggedIn, usersController.unapproved_list);
router.post("/approved", NotLoggedIn, usersController.Approved);
router.get("/view/:id", NotLoggedIn, usersController.view);
router.post("/add-fund", NotLoggedIn, usersController.add_money_to_wallet);
router.post(
  "/withdraw-fund",
  NotLoggedIn,
  usersController.debit_money_from_wallet
);

module.exports = router;
