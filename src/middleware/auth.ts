// sample axios call in frontend:
// const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/<path>`, ,{
//   headers: {
//     "x-auth-token": authToken,
//   }
// });

import admin from "@/utils/firebaseAdmin";

export function withAuth(handler: any) {
  return async (req: any, res: any) => {
    try {
      const token = req.headers["x-auth-token"];
      if (!token) {
        return res.status(401).end("No access token, access denied");
      }

      const user = await admin.auth().verifyIdToken(token);

      if (!user) {
        return res.status(401).end("Invalid token, access denied");
      }
      req.user = user;
      return handler(req, res);
    } catch (err: any) {
      return res.status(500).end(err.message);
    }
  };
}
