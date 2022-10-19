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


                // products[i].priceItem=prices[j]

                formulatedData.push({
                  productId:products[i].id,
                  object:products[i].object,
                  active:products[i].active,
                  default_price:products[i].default_price,
                  name:products[i].name,
                  description:products[i].description,
                  priceItem:{
                      id:prices[j].id,
                      object:prices[j].object,
                      currency:prices[j].currency,
                      nickname:prices[j].nickname,
                      product:prices[j].product,
                      unit_amount:prices[j].unit_amount
                  }
                  
                })
              }
              
            }
      
    }
    // console.log(products,"PRICESSSS",prices)
    res.json(formulatedData);
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

  exports.updateSubscription = async (req, res) => {
    // Save User to Database

    let {subscriptionId,priceId}=req.body
   
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const  update= await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
      // proration_behavior: 'create_prorations',
      proration_behavior: 'always_invoice',
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }]
    });
    
   
    res.json(update);
    
      
    
  };
  exports.createSession = async (req, res) => {
    // Save User to Database

    const user=  await User.findOne({ where: { id: req.body.id } })
    const session=await stripe.checkout.sessions.create({
        mode:"subscription",
        payment_method_types:["card"],
        line_items:[{
            price:req.body.priceId,
            quantity:1
        }],
        success_url:"https://ipfs.bakeree.io/projects",
        cancel_url:"https://ipfs.bakeree.io/Billing",
        customer:user.stripeCustomerId
    })
      
    return res.json(session)
  };

