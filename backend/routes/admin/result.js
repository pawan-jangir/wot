const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const ResultController = require("../../controllers/admin/resultController");

router.get("/list", NotLoggedIn, ResultController.result);
router.post("/add", NotLoggedIn, ResultController.save_result);
router.post("/edit", NotLoggedIn, ResultController.resultEdit);
router.post("/delete", NotLoggedIn, ResultController.resultDelete);
router.post("/show_winners", NotLoggedIn, ResultController.show_winners);
router.post("/declare_result", NotLoggedIn, ResultController.declare_result);

module.exports = router;
