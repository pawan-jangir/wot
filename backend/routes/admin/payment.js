const router = require("express").Router();
const PaymentController = require("../../controllers/admin/paymentController");

router.get("/list", PaymentController.list);
router.get("/transaction_history", PaymentController.transaction_list);
router.post("/credit_update_status", PaymentController.credit_update_status);
router.post("/update_status", PaymentController.update_status);


module.exports = router;
