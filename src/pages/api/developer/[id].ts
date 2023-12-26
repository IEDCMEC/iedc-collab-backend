import db from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetProjects(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id }: { id?: string } = req.query;
    if (!id) {
      return res.status(200).json([]);
    } else {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return res.status(200).json(docSnap.data());
      } else {
        return res.status(200).json([]);
      }
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
