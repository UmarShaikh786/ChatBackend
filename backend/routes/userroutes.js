const router=require('express').Router()
const {registerController}=require("../controllers/usercontroller")
const {loginController}=require("../controllers/usercontroller")
const {setAvatarController}=require("../controllers/usercontroller")
const {getAllUsersController}=require("../controllers/usercontroller")

router.post("/register",registerController)
router.post("/login",loginController)
router.post("/setAvatar/:id",setAvatarController)
router.get("/allusers/:id",getAllUsersController)

module.exports=router