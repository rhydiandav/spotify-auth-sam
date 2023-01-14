exports.login = async () => {
  try {
    return {
      statusCode: 302,
      headers: {
        Location: "https://accounts.spotify.com/authorize?",
      },
    };
  } catch (err) {
    console.log(err);
    return err;
  }
};
