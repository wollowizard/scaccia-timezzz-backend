import userService from "../user/user-service";
import { BASE_URL, createAdminHeader, createUserHeader } from "./test-utils";
import axios from "axios";
import { UserTimezone } from "../model";
import timezoneService from "../timezone/timezone-service";
import mongoRepo from "../mongo";

require('dotenv').config()


describe('Timezone endpoints', () => {
  let userHeader: object;
  let adminHeader: object;

  let UID_ADMIN: string
  let UID_USER: string;

  beforeAll(async () => {
    adminHeader = await createAdminHeader();
    userHeader = await createUserHeader();
    await mongoRepo.init();
    UID_ADMIN = (await userService.getUsers("test-admin@test.com"))[0].sub
    UID_USER = (await userService.getUsers("test-user@test.com"))[0].sub


    console.log("UID_ADMINUID_ADMINUID_ADMINUID_ADMINUID_ADMINUID_ADMIN", UID_ADMIN)
    console.log("UID_USERUID_USERUID_USERUID_USERUID_USERUID_USERUID_USER", UID_USER)

    await timezoneService.addTimezone({
      uid: UID_USER,
      timezoneName: "__TestUser1/GMT",
      timezoneCity: "CityGMT",
      gmtDifferenceMinutes: 0
    })
    await timezoneService.addTimezone({
      uid: UID_USER,
      timezoneName: "__TestUser2/GMT",
      timezoneCity: "CityGMT",
      gmtDifferenceMinutes: 0
    })
    await timezoneService.addTimezone({
      uid: UID_ADMIN,
      timezoneName: "__TestAdmin/GMT",
      timezoneCity: "CityGMT",
      gmtDifferenceMinutes: 0
    })
  })

  afterAll(async () => {
    await timezoneService.deleteTimezone(UID_USER, "__TestUser1/GMT")
    await timezoneService.deleteTimezone(UID_USER, "__TestUser2/GMT")
    await timezoneService.deleteTimezone(UID_ADMIN, "__TestAdmin/GMT")
  })

  const getTz = async (uid: string | undefined, tzName: string, asAdmin: boolean) => {
    const tzs: UserTimezone[] = (await axios.get(`${BASE_URL}/rest/timezones/`,
      {
        headers: asAdmin ? {...adminHeader} : {...userHeader},
        params: asAdmin ? {uid} : undefined
      }))
      .data
    return tzs.find(tz => tz.uid === uid && tz.timezoneName === tzName);
  }

  test('Get Tz of user as admin', async () => {
    expect(await getTz(UID_USER, "__TestUser1/GMT", true)).toBeTruthy()
  })

  test('Get Tz of admin as admin', async () => {
    expect(await getTz(UID_ADMIN, "__TestAdmin/GMT", true)).toBeTruthy()
  })


  test('Get Tz of user as user', async () => {
    expect(await getTz(UID_USER, "__TestUser1/GMT", false)).toBeTruthy()
  })

  test('Authorization: Try to get other users entries', async () => {
    try{
      await axios.get(`${BASE_URL}/rest/timezones/?uid=${UID_ADMIN}`,{headers: userHeader})
      fail("Should not be authorized")
    }catch (e){
      expect(e.response.status).toEqual(403)
    }
  })
})
