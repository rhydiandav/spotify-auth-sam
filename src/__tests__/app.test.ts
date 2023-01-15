import * as nock from "nock";
const app = require("../app");
import {
  missingCodeErrorMessage,
  missingEnvVarsErrorMessage,
} from "../constants";

const testClientID = "123";
const testRedirectURI = "http://redirect.uri";
const testScope = "scope";
const testClientUri = "http://client.uri";
const testSecret = "456";
const testCode = "code";
const testAccessToken = "access_token";
const testRefreshToken = "refresh_token";

const mockSpotifyToken = async () => {
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

describe("login", () => {
  const defaultEnv = process.env;

  beforeEach(() => {
    process.env = { ...defaultEnv };
  });

  it("redirects to spotify login with the necessary parameters", async () => {
    process.env.CLIENT_ID = testClientID;
    process.env.REDIRECT_URI = testRedirectURI;
    process.env.SCOPE = testScope;

    const result = await app.login();

    expect(result.statusCode).toEqual(302);

    expect(result.headers.Location).toEqual(
      `https://accounts.spotify.com/authorize?client_id=${testClientID}&response_type=code&redirect_uri=${testRedirectURI}&scope=${testScope}`
    );
  });

  it("returns an error if environment variables are missing", async () => {
    const result = await app.login();

    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(missingEnvVarsErrorMessage);
  });
});

describe("callback", () => {
  const defaultEnv = process.env;

  beforeEach(() => {
    process.env = { ...defaultEnv };
  });

  it("gets access and refresh tokens from spotify and returns redirect to client with tokens", async () => {
    process.env.CLIENT_ID = testClientID;
    process.env.REDIRECT_URI = testRedirectURI;
    process.env.CLIENT_URI = testClientUri;
    process.env.CLIENT_SECRET = testSecret;

    await mockSpotifyToken();

    const result = await app.callback({
      queryStringParameters: {
        code: testCode,
      },
    });

    expect(result.statusCode).toEqual(302);
    expect(result.headers.Location).toEqual(
      `${testClientUri}?access_token=${testAccessToken}&refresh_token=${testRefreshToken}`
    );
  });

  it("returns an error if environment variables are missing", async () => {
    await mockSpotifyToken();

    const result = await app.callback({
      queryStringParameters: {
        code: testCode,
      },
    });

    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(missingEnvVarsErrorMessage);
  });

  it("returns an error if no code found in event", async () => {
    process.env.CLIENT_ID = testClientID;
    process.env.REDIRECT_URI = testRedirectURI;
    process.env.CLIENT_URI = testClientUri;
    process.env.CLIENT_SECRET = testSecret;

    await mockSpotifyToken();

    const result = await app.callback({
      queryStringParameters: {
        code: undefined,
      },
    });

    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual(missingCodeErrorMessage);
  });
});
