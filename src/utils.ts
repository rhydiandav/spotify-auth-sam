import { request } from "https";

export const getTokens = async (params: {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  code: string;
  REDIRECT_URI: string;
}) => {
  const { CLIENT_ID, CLIENT_SECRET, code, REDIRECT_URI } = params;

  return new Promise((resolve, reject) => {
    const req = request(
      {
        hostname: "accounts.spotify.com",
        path: "/api/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${CLIENT_ID}:${CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve(data);
        });
      }
    );

    req.on("error", (error) => {
      reject(error);
    });

    req.write(
      `grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`
    );
    req.end();
  });
};
