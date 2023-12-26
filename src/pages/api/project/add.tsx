import db from "@/utils/firebase";
import { renderEmail } from "react-html-email";
import axios from "axios";
import { DocumentData, addDoc, collection } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import InvitationEmail from "@/components/InvitationEmail/InvitationEmail";

export default async function AddProject(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await addDoc(collection(db, "projects"), req.body)
    .then(async () => {
      req.body.teamMembers.forEach(async (member: string) => {
        let sent = false;
        const developersResponse = await axios.post(
          "process.env.BACKEND_BASE_URL/api/developer"
        );
        developersResponse.data.forEach((dev: DocumentData) => {
          if (dev.email === member) {
            sent = true;
          }
        });
        if (sent === false)
          axios.post("process.env.BACKEND_BASE_URL/api/mail", {
            toEmail: member,
            subject: "Invitation to join IEDC Collab",
            content: renderEmail(
              <InvitationEmail data={req.body} member={member} />
            ),
          });
      });
      res
        .status(200)
        .json({
          message: `Project added successfully with ID : ${req.body.id}.`,
        });
    })
    .catch((error) => {
      console.error("Oops! Project isn't added.\nMore info:", error);
    });
}
