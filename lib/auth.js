import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const COOKIE = "aib_session";

export function setSession(res, payload){
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.setHeader("Set-Cookie", serialize(COOKIE, token, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60*60*24*7
  }));
}

export function clearSession(res){
  res.setHeader("Set-Cookie", serialize(COOKIE, "", {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0
  }));
}

export function getSession(req){
  const header = req.headers.cookie || "";
  const part = (header.split(/; */).find(c => c.startsWith(COOKIE+"=")) || "").split("=")[1];
  if (!part) return null;
  try {
    return jwt.verify(decodeURIComponent(part), process.env.JWT_SECRET);
  } catch { return null; }
}
