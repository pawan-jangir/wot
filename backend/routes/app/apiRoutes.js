const router = require("express").Router();
const { NotLoggedIn } = require("../../middlewares/Appauth");
const ApiController = require("../../controllers/app/apiController");

router.get("*",  (req,res,next)=>{
  console.log(req.url);
  console.log(req.headers);
  next();
});
router.get("/users", NotLoggedIn, ApiController.users);
router.get("/aboutus", NotLoggedIn, ApiController.about);
router.get("/contactus", NotLoggedIn, ApiController.contact);
router.get("/faq", NotLoggedIn, ApiController.faq);
router.get("/slider", NotLoggedIn, ApiController.slider);
router.get("/products",  ApiController.products);
router.get("/privacypolicy", NotLoggedIn, ApiController.privacypolicy);
router.get("/termscondition", NotLoggedIn, ApiController.termscondition);

router.get("/games_list", NotLoggedIn, ApiController.games_list);
router.get("/delhi_games", NotLoggedIn, ApiController.delhi_game);
router.get("/mumbai_games", NotLoggedIn, ApiController.mumbai_game);
router.get("/starline_games", NotLoggedIn, ApiController.starline_game);

router.get("/game_types", NotLoggedIn, ApiController.game_types);

router.all(
  "/user/get_user_wallet_details",
  NotLoggedIn,
  ApiController.get_user_wallet_details
);
router.post(
  "/user/add_money_to_wallet",
  NotLoggedIn,
  ApiController.add_money_to_wallet
);
router.post(
  "/user/credit_requests_list",
  NotLoggedIn,
  ApiController.credit_requests_list
);
router.post(
  "/user/credit_request_generate",
  NotLoggedIn,
  ApiController.credit_request_generate
);
router.post(
  "/user/debit_money_from_wallet",
  NotLoggedIn,
  ApiController.debit_money_from_wallet
);
router.post(
  "/user/withdrawl_requests_list",
  NotLoggedIn,
  ApiController.withdrawl_requests_list
);
router.post(
  "/user/withdrawl_request_generate",
  NotLoggedIn,
  ApiController.withdrawl_request_generate
);

router.post("/user/bid_create", NotLoggedIn, ApiController.user_bid_create);
router.get("/result", NotLoggedIn, ApiController.result);
router.post("/market_result", NotLoggedIn, ApiController.market_result);
router.all("/bid-history", NotLoggedIn, ApiController.bid_history);
router.post("/winning-history", NotLoggedIn, ApiController.winning_history);
router.get("/settings/list", NotLoggedIn, ApiController.settings);
router.post("/games_result_wise", ApiController.games_result_wise);


router.post(
  "/add_cart",
  ApiController.add_cart
);
router.post(
  "/contact_us",
  ApiController.contact_us
);
router.get(
  "/page/:page_type",
  ApiController.get_cms_page
);

router.get(
  "/get_cart/:cart_id",
  ApiController.get_cart
);

router.post(
  "/update_cart",
  ApiController.update_cart
);


module.exports = router;
