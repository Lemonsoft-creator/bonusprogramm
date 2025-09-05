import { clearSession } from "@/lib/auth";

export default async function handler(req, res){
  clearSession(res);
  res.writeHead(302, { Location: "/" });
  res.end();
}
