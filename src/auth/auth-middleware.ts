import jwt from "express-jwt";
import jwks from 'jwks-rsa';
import { domain } from "./config";
import express from "express";
import _ from "lodash";
import authService from "./auth-service";
import { UserProfile } from "./model";


declare global {
  namespace Express {
    interface Request {
      userProfile: UserProfile
      user: {
        sub: string
      }
    }
  }
}


export const userInfo = (req: express.Request) => {
  return _.pick(req.userProfile, "sub", "email", "name");
}


const profileResolver = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const accessToken = req?.headers?.authorization?.split(' ')[1]!!;
    const userProfile: UserProfile = await authService.getUser(accessToken);
    await authService.upsertUser(userProfile);
    req.userProfile = userProfile;
    next()
  } catch (e) {
    res.status(403).json({"error": "Can't get user profile"})
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

const isAdmin = (user: any) => {
  const roles = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  return Array.isArray(roles) && roles.includes("Admin");
}

export const adminMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({"error": "Admin access required"});
  }
  return next()
}

let authMiddlewares = [checkJwt, profileResolver]
/*
if (process.env.ACTIVE_PROFILE === "test") {
  authMiddlewares = [async (req, res, next) => {
    req.userProfile = {sub: "google-oauth2|113300806490854534957"}
    next()
  }]
}*/
export default authMiddlewares;
