import ConfirmationEmail from "@/components/ConfirmationEmail/ConfirmationEmail";
import { withAuth } from "@/middleware/auth";
import db from "@/utils/firebase";
import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { renderEmail } from "react-html-email";

async function DeclineInvite(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const requestResponse = await axios.get(
    `process.env.BACKEND_BASE_URL/api/request/${req.body.id}`
  );
  if (requestResponse.data) {
    const requestsRef = doc(db, "requests", `${req.body.id}`);
    await updateDoc(requestsRef, {
      status: "declined",
    })
      .then(() => {
        axios.post("process.env.BACKEND_BASE_URL/api/mail", {
          toEmail: req.body.sender_email,
          subject: `Invite Declined by ${req.body.receiver} from IEDC Collab`,
          content: renderEmail(
            <ConfirmationEmail request={req.body} status={"declined"} />
          ),
        });
        res.status(200).json({ message: `Request Declined successfully` });
      })
      .catch((error) => {
        console.error("Oops! Invite Decline Failed.\nMore info:", error);
        res.status(500).json({ message: `Invite Decline Failed` });
      });
  }
}

export default withAuth(DeclineInvite)