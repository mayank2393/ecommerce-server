import nodemailer from 'nodemailer';



export const mailSender = async(email:string, title:string, body:string) => {
  console.log("Hello Mailer");
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "StudyNotion",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);
    return info;
  } catch (error:any) {
    console.log(error.message);
  }
};