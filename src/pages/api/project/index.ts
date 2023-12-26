import db from "@/utils/firebase";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetProjects(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    let projects: DocumentData[] = [];
    const projectsSnapshot = await getDocs(collection(db, "projects"));
    projectsSnapshot.forEach((doc) => {
      projects.push(doc.data());
    });
    return res.status(200).json(projects);
  }
  return res.status(405).json({ message: "Method Not Allowed" });
}
