import db from "@/utils/firebase";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetDevelopers(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
