import nodemailer from 'nodemailer';
/**
 * This Module uses nodemailer transporter to send
 * emails to users based on proirity
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
const sendEmailInvite = (useremail, url) => {
  const mailOptions = {
    subject: 'Invitation to CFH Game',
    from: 'Team Isildur',
    to: useremail,
    text: `Your Friend is inviting you to join CFH game?.
     To join, click this link ${url}`,
    html: `So to join a game .\n
          Use this link <a href="${url}">${url}</a>`
  };
  transporter.sendMail(mailOptions, (err, msg) => {
    if (err) {
    //   console.log(err);
      return err;
    }
    return `Message ${msg.messageId} sent: ${msg.response}`;
  });
};
module.exports = sendEmailInvite;
