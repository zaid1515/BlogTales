const sendEmail = require("./sendEmail");

const sendToken=async(verificationToken,newUser)=>{
     const verificationUrl = `${process.env.BASE_URL}/verify-token?token=${verificationToken}`;
     const subject = `Verify your Email - BlogTales`;
     const emailContent = `
       <p>Hello ${newUser.name},</p>
       <p>Thank you for registering at BlogTales.</p>
       <p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>
       <p>This link will expire in 10 minutes.</p>
     `;
   
     await sendEmail(
       process.env.SENDER_EMAIL,
       process.env.SENDER_NAME,
       newUser.email,
       newUser.name,
       subject,
       emailContent
     );
}

module.exports=sendToken