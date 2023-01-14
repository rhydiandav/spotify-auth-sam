exports.login = async () => {
  const { CLIENT_ID, REDIRECT_URI, SCOPE } = process.env;

  try {
    return {
      statusCode: 302,
      headers: {
        Location: `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`,
      },
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
