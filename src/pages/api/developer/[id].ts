import db from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
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
      const userQuery = query(collection(db, "users"), where("uid", "==", id));
      const docSnap = await getDocs(userQuery);

      if (!docSnap.empty) {
        const firstDoc = docSnap.docs[0];

        return res.status(200).json({ ...firstDoc.data(), id: firstDoc.id });
      } else {
        return res.status(200).json([]);
      }
    }
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
