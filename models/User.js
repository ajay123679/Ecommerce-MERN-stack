const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img: { type: String },
    tokens:[
        {
            token: { type: String, required: true }
        }
       
    ]
  },
  { timestamps: true }
);
UserSchema.methods.generateAuthToken= async function(){
    try{
        let token=jwt.sign(
            {
              id: this._id,
              isAdmin: this.isAdmin,
            },
            process.env.JWT_SEC,
            {expiresIn:"3d"}
          );
          this.tokens=this.tokens.concat({token:token});
          this.save();
          return token;
    }
    catch(err)
    {
        console.log(err);
    }
}
module.exports = mongoose.model("User", UserSchema);