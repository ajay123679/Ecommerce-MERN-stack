const express = require('express')
const app = express()
const port =process.env.port|| 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookie=require('cookie-parser')
app.use(express.json())
app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});



dotenv.config();
const userRoute = require("./routes/user");
const authRoute=  require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
mongoose.connect(process.env.MONGO_URL,{
     
     useNewUrlParser:true,
     useUnifiedTopology:true,
}).then(()=>{
       console.log("connection is successful");
}).catch((e)=>{
     console.log("No Connection"); 
})

app.use(cookie())

app.use("/api/auth",authRoute);
app.use("/api/users",userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })