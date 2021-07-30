import { BASE_URL, createAdminHeader, createUserHeader } from "./test-utils";
import axios from "axios";
import { UserProfile } from "../auth/model";

describe('User endpoints', () => {
  let adminHeader: object;
  let userHeader: object;

  beforeAll(async () => {
    adminHeader = await createAdminHeader();
    userHeader = await createUserHeader();
  })


  test('Get all users', async () => {
    const users: UserProfile[] = (await axios.get(`${BASE_URL}/rest/admin/users/?search=Alf`, {headers: {...adminHeader}}))
      .data

    const alfredo = users?.find(u => u.sub === 'google-oauth2|113300806490854534957')
    expect(alfredo?.email).toEqual("alfredo.scaccialepre@gmail.com")
  })

  test('Get all users non admin', async () => {
    try {
      (await axios.get(`${BASE_URL}/rest/admin/users/`, {headers: {...userHeader}}))
      fail("Exception not trown")
    } catch (e) {
      expect(e.message).toContain("Request failed with status code 403")
    }
  })
})
