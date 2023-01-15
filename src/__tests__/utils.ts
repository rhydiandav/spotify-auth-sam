import * as nock from "nock";
import {
  testAccessToken,
  testClientID,
  testClientUri,
  testCode,
  testRedirectURI,
  testRefreshToken,
  testSecret,
} from "./constants";

export const mockSpotifyToken = async () => {
  nock("https://accounts.spotify.com")
    .post("/api/token", {
      grant_type: "authorization_code",
      code: testCode,
      redirect_uri: testRedirectURI,
    })
    .reply(200, {
      access_token: testAccessToken,
      refresh_token: testRefreshToken,
    });
};

export const setCallbackEnvironmentVariables = () => {
  process.env.CLIENT_ID = testClientID;
  process.env.REDIRECT_URI = testRedirectURI;
  process.env.CLIENT_URI = testClientUri;
  process.env.CLIENT_SECRET = testSecret;
};
