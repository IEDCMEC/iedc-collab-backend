import { withAuth } from "@/middleware/auth";
import db from "@/utils/firebase";
import {
  DocumentData,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { NextApiResponse } from "next";
import NextCors from "nextjs-cors";

async function GetRequestsRecieved(req: any, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  if (req.method === "GET") {
    let requests: DocumentData[] = [];
    const reqQuery = query(
      collection(db, "requests"),
      where("receiver_id", "==", req.user.uid),
      orderBy("createdAt", "desc")
    );
    const requestsSnapshot = await getDocs(reqQuery);
    requestsSnapshot.forEach((doc) => {
      requests.push({ ...doc.data(), id: doc.id });
    });
    return res.status(200).json(requests);
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}

export default withAuth(GetRequestsRecieved);
