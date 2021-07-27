import { UserProfile } from "../auth/model";
import mongoRepo from "../mongo";

class UserService {
  coll = () => mongoRepo.db().collection("users")


  getUsers = (search: string, limit: number = 10): Promise<UserProfile[]> => {
    let filter = {};
    if (search?.length) {
      filter = {
        $or: [
          {"email": {$regex: search, $options: 'i'}},
          {"name": {$regex: search, $options: 'i'}},
          {"uid": {$regex: search, $options: 'i'}}
        ]
      }
    }
    return this.coll().find(filter).limit(limit).toArray()
  }

  upsertUser = (userProfile: UserProfile) => {
    return this.coll().updateOne({uid: userProfile.sub}, {
      $set: {...userProfile}
    }, {upsert: true});
  }
}

const userService = new UserService();
export default userService;
