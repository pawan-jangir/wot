const router = require("express").Router();
const ProductController = require("../../controllers/admin/productController");
const { NotLoggedIn } = require("../../middlewares/Adminauth");

router.get("/list", NotLoggedIn, ProductController.list);
router.post("/add", NotLoggedIn, ProductController.add);
router.post("/edit", NotLoggedIn, ProductController.edit_product);
router.post("/delete", NotLoggedIn, ProductController.delete);

module.exports = router;
