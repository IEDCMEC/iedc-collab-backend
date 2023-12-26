import ConfirmationEmail from "@/components/ConfirmationEmail/ConfirmationEmail";
import { withAuth } from "@/middleware/auth";
import db from "@/utils/firebase";
import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { renderEmail } from "react-html-email";

async function AcceptInvite(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const projectResponse = await axios.get(
    `process.env.BACKEND_BASE_URL/api/project/${req.body.project_id}`
  );
  const requestResponse = await axios.get(
    `process.env.BACKEND_BASE_URL/api/request/${req.body.id}`
  );
  if (requestResponse.data) {
    const requestsRef = doc(db, "requests", `${req.body.id}`);
    await updateDoc(requestsRef, {
      status: "declined",
    }).then(async () => {
      if (projectResponse.data) {
        let users = projectResponse.data.teamMembers;
        users.push(req.body.sender_email);
        const projectsRef = doc(db, "projects", `${req.body.project_id}`);
        await updateDoc(projectsRef, {
          teamMembers: users,
        })
          .then(() => {
            axios.post("process.env.BACKEND_BASE_URL/api/mail", {
              toEmail: req.body.receiver_email,
              subject: `Invite Accepted by ${req.body.receiver} from IEDC Collab`,
              content: renderEmail(
                <ConfirmationEmail request={req.body} status={"accepted"} />
              ),
            });
            res.status(200).json({ message: `Invite Accepted successfully` });
          })
          .catch((error) => {
            console.error("Oops! Invite wasn't sent.\nMore info:", error);
          });
      }
    });
  }
}

export default withAuth(AcceptInvite)