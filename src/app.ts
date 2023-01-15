import { APIGatewayProxyEvent } from "aws-lambda";
import {
  missingEnvVarsErrorMessage,
  missingCodeErrorMessage,
} from "./constants";
import { getTokens } from "./utils";

exports.login = async () => {
  try {
    const { CLIENT_ID, REDIRECT_URI, SCOPE } = process.env;

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
  try {
    const { code } = event.queryStringParameters;

    if (!code) {
      throw new Error(missingCodeErrorMessage);
    }

    const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, CLIENT_URI } = process.env;

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !CLIENT_URI) {
      throw new Error(missingEnvVarsErrorMessage);
    }

    // TODO: error handling for token request
    const data = await getTokens({
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
      code,
    });

    const response = JSON.parse(data.toString());

    const { access_token, refresh_token } = response;

    return {
      statusCode: 302,
      headers: {
        Location: `${CLIENT_URI}?access_token=${access_token}&refresh_token=${refresh_token}`,
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
