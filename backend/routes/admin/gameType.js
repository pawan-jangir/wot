const router = require("express").Router();
const GameTypeController = require("../../controllers/admin/gameTypeController");

router.get("/list", GameTypeController.list);
router.post("/add", GameTypeController.add);
router.post("/edit", GameTypeController.edit);
router.post("/delete", GameTypeController.delete);

module.exports = router;
