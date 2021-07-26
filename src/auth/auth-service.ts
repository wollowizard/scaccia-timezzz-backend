import { Cacheable } from "cache-flow";
import { domain } from "./config";
import { UserProfile } from "./model";
import mongoRepo from "../mongo";

const AuthenticationClient = require('auth0').AuthenticationClient;


const auth0 = new AuthenticationClient({domain});

class AuthService {

  coll = () => mongoRepo.db().collection("users")


  @Cacheable({options: {expirationTime: 60 * 60}})
  public async getUser(accessToken: string): Promise<UserProfile> {
    const userProfile = await auth0.getProfile(accessToken);
    return userProfile;
  }

  upsertUser = (userProfile: UserProfile) => {
    return this.coll().updateOne({uid: userProfile.sub}, {
      $set: {...userProfile}
    }, {upsert: true});
  }
}

export default new AuthService();
