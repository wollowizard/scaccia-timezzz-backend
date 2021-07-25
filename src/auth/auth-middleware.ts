import jwt from "express-jwt";
import jwks from 'jwks-rsa';
import express from "express";
import _ from "lodash";
import { domain } from "./config";
import authService from "./auth-service";
import { UserProfile } from "./model";


declare global {
  namespace Express {
    interface Request {
      userProfile: UserProfile
    }
  }
}

export const userInfo = (req: express.Request) => {
  return _.pick(req.userProfile, "sub", "email", "name");
}

const profileResolver = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const accessToken = req?.headers?.authorization?.split(' ')[1]!!;
    const userProfile = await authService.getUser(accessToken);
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

let authMiddlewares = [checkJwt, profileResolver]
if (process.env.ACTIVE_PROFILE === "test") {
  authMiddlewares = [async (req, res, next) => {
    req.userProfile = {sub: "google-oauth2|113300806490854534957"}
    next()
  }]
}
export default authMiddlewares;
