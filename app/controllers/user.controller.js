const db = require("../models");
var bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");

const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.updateUser = async (req, res) => {
  const {data} = req.body;
  console.log(data, "updateddddddd");

  if (data.password) {
    data.password = bcrypt.hashSync(data.password, 8);
  }

  try {
    const userUpdate = await User.update(data, {
      where: {
        id: req.body.id,
      },
    });

    const userData = await User.findOne({
      where: {
        id: req.body.id,
      },
    });

    const { dataValues } = userData;
    var token = jwt.sign({ id: dataValues.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    var authorities = [];
    userData.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      if (userData && userUpdate) {
        console.log(authorities, "authorities");
        // console.log(userUpdate, "userupdatee");
        res.status(200).send({
          message: " Your setting has been updated",
          id: userData.dataValues.id,
          email: userData.dataValues.email,
          username: userData.dataValues.username,
          accessToken: token,
          roles: authorities,
          stripeCustomerId: userData.dataValues.stripeCustomerId,
        });
      } else {
        res.status(500).send({ message: "Something went wrong" }, userUpdate);
      }
  
      
    });
   
    // console.log(data)
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
