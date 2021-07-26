import jwt from "express-jwt";
import jwks from 'jwks-rsa';
import { domain } from "./config";
import express from "express";
import { UserProfile } from "./model";
import userService from "../user/user-service";
import authService from "./auth-service";


declare global {
  namespace Express {
    interface Request {
      user: UserProfile
    }
  }
}

const userSave = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  userService.upsertUser(req.user);
  next();
}

const profileResolver = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const accessToken = req?.headers?.authorization?.split(' ')[1]!!;
    const userProfile: UserProfile = await authService.getUser(accessToken);
    req.user = {...userProfile, ...req.user};
  } catch (e) {
    console.info(`Can't get user profile for ${req.user.sub}`)
  } finally {
    return next();
  }
}

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),
  audience: 'api',
  issuer: `https://${domain}/`,
  algorithms: ['RS256']
});

export const isAdmin = (user: any) => {
  const roles = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  return Array.isArray(roles) && roles.includes("Admin");
}

export const adminMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({"error": "Admin access required"});
  }
  return next()
}

let authMiddlewares = [checkJwt, profileResolver, userSave]

export default authMiddlewares;
