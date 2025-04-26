const asyncWrap=(asyncFunction)=>{
     return async(req,res,next)=>{
          try {
               await asyncFunction(req,res,next);
          } catch (e) {
               next(e.message)
          }
     }
}

module.exports=asyncWrap
