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
    const {data:products}=await stripe.products?.list()
    const {data:prices}=await stripe.prices?.list()
    let formulatedData=[]
    for (let i = 0; i < products.length; i++) {
            for (let j = 0; j < prices.length; j++) {
              if(products[i].id===prices[j].product){


                products[i].priceItem=prices[j]
                console.log(products[i],"asdasdsaasd",prices[j])
              }
              
            }
      
    }
    // console.log(products,"PRICESSSS",prices)
    res.json(products);
    // res.send("prices")
      
    
  };

  exports.getSubsList = async (req, res) => {
    // Save User to Database

    const customerId=req.params.id
     const subscriptions=await stripe.subscriptions.list({
    customer:customerId,
    status:"all",
    expand:["data.default_payment_method"]
})
    
    // console.log(products,"PRICESSSS",prices)
    res.json(subscriptions);
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
        success_url:"http://3.130.180.119/projects",
        cancel_url:"http://3.130.180.119/Billing",
        customer:user.stripeCustomerId
    })
      
    return res.json(session)
  };

