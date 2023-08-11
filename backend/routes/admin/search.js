const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Adminauth");
const SearchController = require("../../controllers/admin/searchController");



module.exports = router;
