import _ from "lodash";
import * as path from 'path';

export default class ProfileUtils {
  private static mergedConfig: object | undefined = undefined

  public static requireJsonEnvVar(envVarName: string) {
    try {
      const envVar = process.env[envVarName]
      if (!envVar) {
        throw new Error(`could not load env var ${envVarName}`)
      }
      return JSON.parse(envVar);
    } catch (e) {
      throw new Error(`could not load env var ${envVarName}. Error: ${e.message}`)
    }
  }

  public static requireConfig(path: string) {
    if (ProfileUtils.mergedConfig === undefined) {
      ProfileUtils.initConfig();
    }
    const value = _.get(ProfileUtils.mergedConfig, path);
    if (!value) throw Error(`No config ${path}`)
    return value
  }

  private static getProfilesOrFail(): string[] {
    const profileString: string | undefined = process.env.ACTIVE_PROFILE
    if (!profileString) throw Error(`No "ACTIVE_PROFILE" env var defined`)
    return profileString.split(",").map(s => s.trim()).filter(s => !!s)
  }

  private static initConfig() {
    ProfileUtils.mergedConfig = {}
    const profiles: string[] = ProfileUtils.getProfilesOrFail();
    console.info(`initializing config with profiles ${profiles.join(",")}`)
    const baseConfig = require(path.join(process.cwd(), "resources", "profiles", "config.json"))
    _.merge(ProfileUtils.mergedConfig, baseConfig);
    for (const profile of profiles) {
      try {
        const config = require(path.join(process.cwd(), "resources", "profiles", `config-${profile}.json`))
        _.merge(ProfileUtils.mergedConfig, config);
      } catch (err) {
        // console.debug(`Could not load config for profile ${profile}, error: ${err.message}`)
      }
    }
  }
}
