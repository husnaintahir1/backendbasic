const db = require("../models");
var crypto = require('crypto');
const config = require("../config/auth.config");
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID_KEY)



const User = db.user;
const Role = db.role;
const ResetToken=db.ResetToken

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async(req, res) => {
  // Save User to Database

    const customer= await stripe.customers.create({
      email:req.body.email
    })
    console.log(customer,"CUSTOMERRRRRRRRR")

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    stripeCustomerId:customer.id
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          stripeCustomerId:user.stripeCustomerId
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.forgotPassword = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async(user) => {
      if (!user) {
        return res.status(200).send({ message: "ok"});
      }

     await ResetToken.update({
        used: 1
      },
      {
        where: {
          email: req.body.email
        }
    });

    var fpSalt = crypto.randomBytes(64).toString('base64');
    var expireDate = new Date(new Date().getTime() + (60 * 60 * 1000))

    const {dataValues:token}=  await ResetToken.create({
      email: req.body.email,
      expiration: expireDate,
      token: fpSalt,
      used: 0
    });

    console.log(encodeURIComponent(token),"DECODE", token)
    const msg = {
      to: req.body.email, // Change to your recipient
      from: "husnain.tahir@quanrio.com", // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      // html: "<strong>" +'To reset your password, please click the link below.\n\nhttps://'+process.env.DOMAIN+'/user/reset-password?token='+encodeURIComponent(token)+'&email='+req.body.email + "</strong>"
      html: "<strong>" +'To reset your password, please click the link below.\n\n'+"http://localhost:8081"+'/user/reset-password?token='+encodeURIComponent(token.token)+'&email='+req.body.email + "</strong>"
    }

  //send email
  sgMail
  .send(msg)
  .then((response) => {
    console.log(response[0].statusCode,"status code")
    console.log(response[0].headers,"headers")
    res.status(200).send(response);
  })
  .catch((error) => {
    console.error(error,"ERROR")
    res.status(500).send(error);

  })
  

      

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.resetPasswordGet = async(req, res) => {
    try{
      console.log(req.query.email ,"TOEKN",req.query.token)

      await ResetToken.destroy({
        where: {
          expiration: { [Op.lt]: db.Sequelize.fn('CURDATE')},
        }
      });

      const decodedToken=decodeURIComponent(req.query.token)
      console.log(decodedToken,"DECODED _T OKEN")
      var record = await ResetToken.findOne({
        where: {
          email: req.query.email,
          expiration: { [Op.gt]: db.Sequelize.fn('CURDATE')},
          token: decodedToken,
          used: 0
        }
      });


      if (record == null) {
        return res.status(401).send({ message: "Token expired !! try again" });
      }

      return res.status(200).send({ message: "Password Changed Successfully" });

      
    }

    
    catch(err){
      res.status(500).send({ message: err.message });
    }
};

exports.resetPassword = async(req, res) => {
  try{
 

     /**
  * Ensure password is valid (isValidPassword
  * function checks if password is >= 8 chars, alphanumeric,
  * has special chars, etc)
  **/
      const decodedToken=decodeURIComponent(req.body.token)
 
  var record = await ResetToken.findOne({
    where: {
      email: req.body.email,
      expiration: { [Op.gt]: db.Sequelize.fn('CURDATE')},
      token: decodedToken,
      used: 0
    }
  });
 
  if (record == null) {
    return res.json({status: 'error', message: 'Token not found. Please try the reset password process again.'});
  }
 
  var upd = await ResetToken.update({
      used: 1
    },
    {
      where: {
        email: req.body.email
      }
  });
 
 
  await User.update({
    password: bcrypt.hashSync(req.body.password, 8),
    
  },
  {
    where: {
      email: req.body.email
    }
  });
 
  return res.json({status: 'ok', message: 'Password reset. Please login with your new password.'});
    
    
  }

  
  catch(err){
    res.status(500).send({ message: err.message });
  }
};