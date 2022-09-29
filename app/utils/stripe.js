const Stripe =require("stripe")

  exports.stripe= new Stripe(process.env.STRIPE_SECRET_KEY,{apiVersion:"2022-08-01"})

