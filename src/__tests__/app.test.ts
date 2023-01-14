const app = require("../app");

describe("Tests index", function () {
  it("verifies successful response", async () => {
    const result = await app.lambdaHandler();

    expect(result.statusCode).toEqual(200);

    let response = JSON.parse(result.body);

    expect(response.message).toEqual("hello world");
  });
});
