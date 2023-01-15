import { APIGatewayProxyEvent } from "aws-lambda";
import { missingEnvVarsErrorMessage } from "./constants";
import { request } from "https";

exports.login = async () => {
  const { CLIENT_ID, REDIRECT_URI, SCOPE } = process.env;

  try {
    if (!CLIENT_ID || !REDIRECT_URI || !SCOPE) {
      throw new Error(missingEnvVarsErrorMessage);
    }

    return {
      statusCode: 302,
      headers: {
        Location: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};

exports.callback = async (event: APIGatewayProxyEvent) => {
  const { code } = event.queryStringParameters;
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, CLIENT_URI } = process.env;

  const data: string = await new Promise((resolve, reject) => {
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

  const response = JSON.parse(data);

  const { access_token, refresh_token } = response;

  return {
    statusCode: 302,
    headers: {
      Location: `${CLIENT_URI}?access_token=${access_token}&refresh_token=${refresh_token}`,
    },
  };
};
