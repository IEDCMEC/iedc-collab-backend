import db from "@/utils/firebase";
import { renderEmail } from "react-html-email";
import axios from "axios";
import { DocumentData, doc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import InvitationEmail from "@/components/InvitationEmail/InvitationEmail";
import { withAuth } from "@/middleware/auth";
import NextCors from "nextjs-cors";

async function EditProject(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const { id, ...updateFields } = req.body;
  await updateDoc(doc(db, "projects", id), updateFields)
    .then(async () => {
      req.body.teamMembers.forEach(async (member: string) => {
        let sent = false;
        const developersResponse = await axios.get(
          `${process.env.BACKEND_BASE_URL}/api/developer`
        );
        developersResponse.data.forEach((dev: DocumentData) => {
          if (dev.email === member) {
            sent = true;
          }
        });
        if (sent === false)
          axios.post(`${process.env.BACKEND_BASE_URL}/api/mail`, {
            toEmail: member,
            subject: "Invitation to join IEDC Collab",
            content: renderEmail(
              <InvitationEmail data={req.body} member={member} />
            ),
          });
      });
      res.status(200).json({
        message: `Project edited successfully with ID : ${id}.`,
      });
    })
    .catch((error) => {
      console.error("Oops! Project isn't added.\nMore info:", error);
    });
}

export default withAuth(EditProject);
