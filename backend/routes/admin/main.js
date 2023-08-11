const router = require("express").Router();
const MainController = require("../../controllers/admin/mainController");
const ProductController = require("../../controllers/admin/productController");
const { NotLoggedIn } = require("../../middlewares/Adminauth");

router.get("/", MainController.main);
router.get("/admin/orders/list", MainController.orderlist);
router.get("/admin/orders/view/:id", NotLoggedIn, MainController.view);

router.get("/admin/coupons/list_coupon", NotLoggedIn, ProductController.list_coupon);
router.post("/admin/coupons/add_coupon", NotLoggedIn, ProductController.add_coupon);
router.post("/admin/coupons/edit_coupon", NotLoggedIn, ProductController.edit_product_coupon);
router.post("/admin/coupons/delete_coupon", NotLoggedIn, ProductController.delete_coupon);

router.get(
  "/admin/notification/list",
  NotLoggedIn,
  MainController.notification_list
);
router.post(
  "/admin/notification/add",
  NotLoggedIn,
  MainController.notification_add
);

module.exports = router;
