import { Cacheable } from "cache-flow";
import { domain } from "./config";
import { UserProfile } from "./model";

const AuthenticationClient = require('auth0').AuthenticationClient;


const auth0 = new AuthenticationClient({domain});

class AuthService {

  @Cacheable({options: {expirationTime: 60 * 60}})
  public async getUser(accessToken: string): Promise<UserProfile> {
    const userProfile = await auth0.getProfile(accessToken);
    return userProfile;
  }
}

export default new AuthService();
