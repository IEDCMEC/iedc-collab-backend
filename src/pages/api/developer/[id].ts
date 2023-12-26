import db from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function GetDeveloperById(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  if (req.method === "GET") {
    const { id }: { id?: string } = req.query;
    if (!id) {
      return res.status(200).json([]);
    } else {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return res.status(200).json({ ...docSnap.data(), id: docSnap.id });
      } else {
        return res.status(200).json([]);
      }
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
