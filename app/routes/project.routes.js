const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/project.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/project/createproject",
    [authJwt.verifyToken],
    controller.createProject
  );

  app.get(
    "/api/project/getProject",
    [authJwt.verifyToken],
    controller.getAllProject
  );

//   app.post("/api/auth/signin", controller.signin);

//   app.post("/api/auth/signout", controller.signout);
};