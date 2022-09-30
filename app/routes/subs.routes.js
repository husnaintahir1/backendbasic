const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/subs.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/prices",
    [authJwt.verifyToken],
    controller.getPrices
  );
  app.post(
    "/api/session",
    [authJwt.verifyToken],
    controller.createSession
  );

  app.get(
    "/api/subscriptionList/:id",
    [authJwt.verifyToken],
    controller.getSubsList
  );



//   const subscriptions=await stripe.subscriptions.list({
//     customer:user.stripeCustomerId,
//     status:"all",
//     expand:["data.default_payment_method"]
// })


//   app.get(
//     "/api/project/getProject",
//     [authJwt.verifyToken],
//     controller.getAllProject
//   );

};