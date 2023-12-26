import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

async function SendMail(req: NextApiRequest, res: NextApiResponse) {
  const responsefromMailer = await axios.post(process.env.MAILER_API_URL!, {
    toEmail: req.body.toEmail,
    subject: req.body.subject,
    content: req.body.content.toString(),
    password: process.env.MAILER_API_PASSWORD,
  });
  if (responsefromMailer.data.status === 200) {
    return res.status(200).json({ message: "Email sent successfully." });
  }
  res.status(500).json({ message: responsefromMailer });
}

export default SendMail;
