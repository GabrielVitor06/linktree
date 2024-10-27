import { JWTPayload, SignJWT, jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export function createJWT(payload: JWTPayload, expirationTimeInS: number) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + expirationTimeInS * 1000))
    .sign(secretKey);
}

export async function verifyJWT(jwt: string) {
  return (await jwtVerify(jwt, secretKey)).payload;
}
