const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
// const Adminauth = require("../../models/Adminauth");

const DashboardController = require("../../controllers/admin/dashboardController");

// router.get("/dashboard", NotLoggedIn, async (req, res) => {
//   const Adminauth = require("../../models/Adminauth");
const Setting = require("../../models/Setting");
//   return res.render("admin/dashboard" , {admin});
// });
router.get("/dashboard", NotLoggedIn, DashboardController.dashboard);

module.exports = router;
