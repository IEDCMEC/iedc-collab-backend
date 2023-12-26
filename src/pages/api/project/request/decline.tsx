import ConfirmationEmail from "@/components/ConfirmationEmail/ConfirmationEmail";
import db from "@/utils/firebase";
import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { renderEmail } from "react-html-email";

export default async function AcceptRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
          subject: `Request Declined by ${req.body.receiver} from IEDC Collab`,
          content: renderEmail(
            <ConfirmationEmail request={req.body} status={"declined"} />
          ),
        });
        res.status(200).json({ message: `Request Declined successfully` });
      })
      .catch((error) => {
        console.error("Oops! Request Decline Failed.\nMore info:", error);
        res.status(500).json({ message: `Request Decline Failed` });
      });
  }
}
