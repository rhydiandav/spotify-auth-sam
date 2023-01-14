const app = require("../app");

describe("login", function () {
  it("redirects to spotify login with the necessary parameters", async () => {
    const result = await app.login();

    expect(result.statusCode).toEqual(302);
  });
});
