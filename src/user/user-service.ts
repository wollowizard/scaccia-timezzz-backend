import { UserProfile } from "../auth/model";
import mongoRepo from "../mongo";

class UserService {
  coll = () => mongoRepo.db().collection("users")


  getUsers = (search: string): Promise<UserProfile[]> => {
    if ("ALL" === search) return this.coll().find().toArray();
    return this.coll().find({
      $or: [
        {"email": {$regex: search}},
        {"name": {$regex: search}},
        {"uid": {$regex: search}}
      ]
    }).toArray()
  }

  upsertUser = (userProfile: UserProfile) => {
    return this.coll().updateOne({uid: userProfile.sub}, {
      $set: {...userProfile}
    }, {upsert: true});
  }
}

const userService = new UserService();
export default userService;
