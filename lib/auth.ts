import { jwtVerify, SignJWT } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret")

export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function signToken(payload: any): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret)
  return token
}

