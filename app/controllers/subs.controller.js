const db = require("../models");
const config = require("../config/auth.config");
// const stripe=require("../utils/stripe")
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = db.user;



const Project = db.project;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { user } = require("../models");



exports.getPrices = async (req, res) => {
    // Save User to Database
    const prices=await stripe.prices?.list()
    console.log(prices,"PRICESSSS")
    res.json(prices);
    // res.send("prices")
      
    
  };
  exports.createSession = async (req, res) => {
    // Save User to Database

    const user= await await User.findOne({ where: { id: req.body.id } })
    const session=await stripe.checkout.sessions.create({
        mode:"subscription",
        payment_method_types:["card"],
        line_items:[{
            price:req.body.priceId,
            quantity:1
        }],
        success_url:"http://localhost:8081/projects",
        cancel_url:"http://localhost:8081/Billing",
        customer:user.stripeCustomerId
    })
      
    return res.json(session)
  };

