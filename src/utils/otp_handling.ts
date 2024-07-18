import { prisma } from "..";
import cron from "node-cron";

cron.schedule("*5/ * * * *",async()=>{
    const expirationTime = new Date(Date.now() - 5*60*1000);

    try {
        await prisma.otp.deleteMany({
            where:{
                createdAt:{
                    lte : expirationTime,
                },
            },
        });
        console.log('Expired OTPs deleted');
    } catch (error) {
        console.log("Error deleting in expired OTPs",error);
    }
})


export const SendVerificationMail = async()=>{

}; 