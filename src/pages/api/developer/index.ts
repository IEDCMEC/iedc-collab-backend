import db from "@/utils/firebase";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function GetDevelopers(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  if (req.method === "GET") {
    let developers: DocumentData[] = [];
    const developersSnapshot = await getDocs(collection(db, "users"));
    developersSnapshot.forEach((doc) => {
      developers.push(doc.data());
    });
    return res.status(200).json(developers);
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
