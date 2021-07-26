import axios from "axios"

export const BASE_URL = "http://localhost:8080"

const requestToken = async (username: string) => {

  return (await axios.post("https://dev-0nn4u59u.us.auth0.com/oauth/token", {
    grant_type: "password",
    username,
    password: process.env.SECRET_TEST_USER_PASSWORD,
    audience: "api",
    scope: "",
    client_id: "q5Y8rwcn6VWfOWjUE05IlZxXxuKvAzIr",
    client_secret: process.env.SECRET_AUTH0_CLIENT_SECRET
  })).data.access_token
}

export const createAdminHeader = async () => {
  return {"Authorization": `Bearer ${(await requestToken("test-admin@test.com"))}`}
}

export const createUserHeader = async () => {
  return {"Authorization": `Bearer ${(await requestToken("test-user@test.com"))}`}
}
