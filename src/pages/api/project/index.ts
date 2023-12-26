import db from "@/utils/firebase";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

export default async function GetProjects(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  if (req.method === "GET") {
    let projects: DocumentData[] = [];
    const projectsSnapshot = await getDocs(collection(db, "projects"));
    projectsSnapshot.forEach((doc) => {
      projects.push({ ...doc.data(), id: doc.id });
    });
    return res.status(200).json(projects);
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
