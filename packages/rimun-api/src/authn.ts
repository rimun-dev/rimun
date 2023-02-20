import { TRPCError } from "@trpc/server";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

/** Authorization header prefix. */
const HEADER_PREFIX = "Bearer ";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * An `express` specific function which verifies authentication
 * tokens in the request header "Authorization" using any provided prefix
 * using a `IAuthProvider` implementation.
 *
 * It returns either the JWT payload or null if the request is not authenticated.
 *
 * @param headerPrefix a string prefix for the authorization header
 * @return {Promise<jwt.JwtPayload | null>} the identity token payload
 */
export async function extractUserIdentityFromRequest(
  req: Request,
  _res: Response
): Promise<jwt.JwtPayload | null> {
  const header = req.headers?.authorization;

  if (
    !header ||
    !header.startsWith(HEADER_PREFIX) ||
    header.length < HEADER_PREFIX.length + 1
  )
    return null;

  const tok = header.substring(HEADER_PREFIX.length);

  return extractUserIdentity(tok);
}

export async function extractUserIdentity(
  token: string
): Promise<jwt.JwtPayload | null> {
  if (!JWT_SECRET)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No JWT secret setup.",
    });

  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
  } catch (e) {
    return null;
  }
}

export async function createToken(userId: string) {
  if (!JWT_SECRET)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No JWT secret setup.",
    });

  return jwt.sign({ iss: "rimun-api", sub: userId }, JWT_SECRET, {
    expiresIn: "60d",
  });
}
