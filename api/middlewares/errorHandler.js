const { CustomAPIError } = require("../errors/custom-error");

var errorHandler=(err,req,res,next)=>{
     if(err instanceof CustomAPIError){
          return res.status(err.statusCode).json({msg:err.message})
     }
     console.log(err);
     return res.status(500).json({msg:err})
}

module.exports=errorHandler