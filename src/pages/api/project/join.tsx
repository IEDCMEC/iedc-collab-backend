import db from "@/utils/firebase";
import { renderEmail } from "react-html-email";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import ProjectRequestEmail from "../../../components/ProjectRequestEmail/ProjectRequestEmail";
import { withAuth } from "@/middleware/auth";

 async function JoinProject(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestData = {
    ...req.body,
    status: "pending",
    type: "request",
    createdAt: Date.now(),
  };

  await addDoc(collection(db, "requests"), requestData)
    .then((docRef) => {
      axios.post("process.env.BACKEND_BASE_URL/api/mail", {
        toEmail: req.body.receiver_email,
        subject: `Request to Join Team of ${req.body.project} from IEDC Collab`,
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

export default withAuth(JoinProject)