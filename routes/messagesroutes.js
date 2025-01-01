const router=require('express').Router()
const {addMessage}=require("../controllers/messagescontroller")
const {getAllMessage}=require("../controllers/messagescontroller")


router.post("/addmsg",addMessage)
router.post("/getmsg",getAllMessage)

module.exports=router