const { CustomAPIError } = require("../errors/custom-error");
const asyncWrap = require("../middlewares/asyncWrap");
const User= require("../models/user");

const getUser=asyncWrap(async(req,res)=>{
     const {userId}=req.params
     if(!userId){
          throw new CustomAPIError("User Id is required",400)
     }
     const user=await User.findOne({_id:userId})
     if(!user){
          throw new CustomAPIError("User not found",404)
     }

     res.status(200).json({
          success:true,
          message:"User Fetched Successfully",
          data:user
     })
})

module.exports={getUser}