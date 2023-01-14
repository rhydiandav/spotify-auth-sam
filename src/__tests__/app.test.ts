const app = require("../app");

const testClientID = "123";
const testRedirectURI = "http://redirect.uri";
const testScope = "scope";

describe("login", function () {
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
});
