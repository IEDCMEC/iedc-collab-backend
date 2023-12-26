import db from "@/utils/firebase";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetRequests(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let requests: DocumentData[] = [];
    const requestsSnapshot = await getDocs(collection(db, "requests"));
    requestsSnapshot.forEach((doc) => {
      requests.push(doc.data());
    });
    return res.status(200).json(requests);
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
