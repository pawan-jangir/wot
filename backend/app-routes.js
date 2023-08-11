const home = require("./routes/app/home");
const auth = require("./routes/app/auth");
const apiRoutes = require("./routes/app/apiRoutes");
const payment = require("./routes/app/payment");

const AppRoutes = (app) => {
  app.use("/app", home);
  app.use("/app/user", auth);
  app.use("/app/payment", payment);
  app.use("/app", apiRoutes);
};

module.exports = AppRoutes;
