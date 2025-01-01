const User = require("../models/Usermodel");
const bcrypt = require("bcrypt");

module.exports.registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ message: "Username already exists", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ message: "Username already exists", status: false });
    }
    const hashPassword = bcrypt.hashSync(password,10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    //    delete user.password
    return res.json({ status: true, user });
  } catch (err) {
    console.log(err);
  }
};

module.exports.loginController = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const userdetails = await User.findOne({ username });
      if (!userdetails) {
        return res.json({ message: "Invalid Username or Password", status: false });
      }
      const isPassword=bcrypt.compare(password,userdetails.password)
      if (!isPassword) {
        return res.json({ message: "Invalid Username or Password", status: false });
      }
         delete userdetails.password
      return res.json({ status: true, userdetails });
    } catch (err) {
      console.log(err);
    }
  };
  
module.exports.setAvatarController = async (req, res, next) => {
   try{
    const userId=req.params.id;
    const avatarImage=req.body.image
    const userData=await User.findByIdAndUpdate(userId,{
        isAvatarImageSet:true,
        avatarImage
    })
    return res.json({status:userData.isAvatarImageSet,image:userData.avatarImage})
}catch(ex)
   {
    next(ex)
   }
  };
  
  module.exports.getAllUsersController = async (req, res, next) => {
        try{
            const users=await User.find({_id:{$ne:req.params.id}}).select([
                "email",
                "username",
                "avatarImage",
                "_id"
            ])
            return res.json(users)
        }catch(ex)
        {
            next(ex)
        }
  };