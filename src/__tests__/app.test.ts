const app = require("../app");

describe("login", function () {
  it("redirects to spotify login with the necessary parameters", async () => {
    const result = await app.login();

    expect(result.statusCode).toEqual(302);

    expect(result.headers.Location).toEqual(
      "https://accounts.spotify.com/authorize?"
    );
  });
});
