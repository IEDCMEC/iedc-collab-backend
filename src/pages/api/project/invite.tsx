import db from "@/utils/firebase";
import { renderEmail } from "react-html-email";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import ProjectRequestEmail from "../../../components/ProjectRequestEmail/ProjectRequestEmail";
import { withAuth } from "@/middleware/auth";
import NextCors from "nextjs-cors";

async function InviteToProject(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const requestData = {
    ...req.body,
    status: "pending",
    type: "invite",
    createdAt: Date.now(),
  };
  try {
    const docRef = await addDoc(collection(db, "requests"), requestData);

    axios.post(`${process.env.BACKEND_BASE_URL}/api/mail`, {
      toEmail: req.body.receiver_email,
      subject: `Invite to join project ${req.body.project} from IEDC Collab`,
      content: renderEmail(<ProjectRequestEmail request={requestData} />),
    });

    res
      .status(200)
      .json({ message: `Invite sent successfully with ID: ${docRef.id}` });
  } catch (error) {
    console.error("Oops! Invite wasn't sent.\nMore info:", error);
  }
}

export default withAuth(InviteToProject);
