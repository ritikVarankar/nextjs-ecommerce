import nodemailer from 'nodemailer';
import SMTPTransport from "nodemailer/lib/smtp-transport";
 
export const sendMail = async(subject: any, receiver: any, body: any)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    } as SMTPTransport.Options);

    const options={
        from:`Developer Ritik <${process.env.NODEMAILER_EMAIL}>`,
        to:receiver,
        subject:subject,
        html: body
    }

    try {
        await transporter.sendMail(options)
        return { success:true }
    } catch (error) {
        if (error instanceof Error) {
            return { success:false, message:error.message }
        } else {
            return {  success:false, message:'An unknown error occurred' }
        }
    }
}