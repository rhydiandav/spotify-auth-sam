import { APIGatewayProxyEvent } from "aws-lambda";
import { missingEnvVarsErrorMessage } from "./constants";

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
  console.log(event);

  return {
    statusCode: 302,
    headers: { Location: "http://location.com" },
  };
};
