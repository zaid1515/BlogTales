const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const userSchema=new mongoose.Schema({
     name:{
          type:String,
          required:true
     },
     email:{
          type:String,
          required:true,
          unique:true
     },
     password:{
          type:String,
          required:true,
          select:false
     },
     role:{
          type:String,
          enum:["user",'admin'],
          required:true
     },
     isVerified:{
          type:Boolean,
          default:false
     },
     emailToken:{
          type:String
     },
     emailTokenExpiry:{
          type:Date
     }
},{timestamps:true})

userSchema.pre('save',async function(next){
     if(!this.isModified('password')){
          return next()
     }          
     const salt=await bcrypt.genSalt(10)
     this.password=await bcrypt.hash(this.password,salt)
     next()
})

userSchema.methods.comparePassword=async function(password){
     return await bcrypt.compare(password,this.password)
}

const User=mongoose.model('User',userSchema)
module.exports=User