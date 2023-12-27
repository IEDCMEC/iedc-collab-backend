import ConfirmationEmail from "@/components/ConfirmationEmail/ConfirmationEmail";
import { withAuth } from "@/middleware/auth";
import db from "@/utils/firebase";
import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { renderEmail } from "react-html-email";

async function AcceptInvite(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const projectResponse = await axios.get(
    `${process.env.BACKEND_BASE_URL}/api/project/${req.body.project_id}`
  );
  const requestResponse = await axios.get(
    `${process.env.BACKEND_BASE_URL}/api/project/request/${req.body.id}`
  );
  if (requestResponse.data) {
    const requestsRef = doc(db, "requests", `${req.body.id}`);
    try {
      await updateDoc(requestsRef, {
        status: "accepted",
      });

      if (projectResponse.data) {
        let users = projectResponse.data.teamMembers;
        users.push(req.body.sender_email);
        const projectsRef = doc(db, "projects", `${req.body.project_id}`);

        try {
          await updateDoc(projectsRef, {
            teamMembers: users,
          });

          await axios.post(`${process.env.BACKEND_BASE_URL}/api/mail`, {
            toEmail: req.body.sender_email,
            subject: `Invite Accepted by ${req.body.receiver} from IEDC Collab`,
            content: renderEmail(
              <ConfirmationEmail request={req.body} status={"accepted"} />
            ),
          });

          return res.status(200).json({ message: `Invite Accepted successfully` });
        } catch (error) {
          console.error("Oops! Invite wasn't sent.\nMore info:", error);
        }
      }
    } catch (error) {
      console.error("Oops! Failed to update request.\nMore info:", error);
    }
  } else {
    console.error("No data in requestResponse.");
  }
}

export default withAuth(AcceptInvite);
