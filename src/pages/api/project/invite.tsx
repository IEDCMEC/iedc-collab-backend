import db from "@/utils/firebase";
import { renderEmail } from "react-html-email";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import ProjectRequestEmail from "../../../components/ProjectRequestEmail/ProjectRequestEmail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestData = {
    ...req.body,
    status: "pending",
    type: "invite",
    createdAt: Date.now(),
  };

  await addDoc(collection(db, "requests"), requestData)
    .then((docRef) => {
      axios.post("process.env.BACKEND_BASE_URL/api/mail", {
        toEmail: req.body.receiver_email,
        subject: `Invite to join project ${req.body.project} from IEDC Collab`,
        content: renderEmail(<ProjectRequestEmail request={requestData} />),
      });
      res
        .status(200)
        .json({ message: `Invite sent successfully with ID: ${docRef.id}` });
    })
    .catch((error) => {
      console.error("Oops! Invite wasn't sent.\nMore info:", error);
    });
}
