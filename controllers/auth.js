const fs = require('fs');
const { response } = require('express');
const AppleAuth = require("apple-auth");
const jwt = require("jsonwebtoken");

const { validarGoogleIdToken } = require('../helpers/google-verify-token');

const googleAuth = async ( req, res = response ) => {

    const token = req.body.token;

    if( !token ) {
        return res.json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }

    const googleUser = await validarGoogleIdToken(token);

    if ( !googleUser ) {
        return res.status(400).json({
            ok: false
        });
    }

    //TODO: Guardar en base de datos

    res.json({
        ok: true,
        googleUser
    });

}

const callbackApple = async (req, res = response) => {
    const redirect = `intent://callback?${new URLSearchParams(
      request.body
    ).toString()}#Intent;package=${
      process.env.ANDROID_PACKAGE_IDENTIFIER
    };scheme=signinwithapple;end`;
  
    console.log(`Redirecting to ${redirect}`);
  
    response.redirect(307, redirect);
}

const signInWithApple = async (request, response) => {
    const auth = new AppleAuth(
      {
        // use the bundle ID as client ID for native apps, else use the service ID for web-auth flows
        // https://forums.developer.apple.com/thread/118135
        client_id:
          request.query.useBundleId === "true"
            ? process.env.BUNDLE_ID
            : process.env.SERVICE_ID,
        team_id: process.env.TEAM_ID,
        redirect_uri:
          "https://app-google-apple-signin-0f15519ad111.herokuapp.com/callbacks/sign_in_with_apple", // does not matter here, as this is already the callback that verifies the token after the redirection
        key_id: process.env.KEY_ID,
      },
      fs.readFileSync('../keys/keysignin.p8').toString(),
      "text"
    );
  
    console.log(request.query);
  
    const accessToken = await auth.accessToken(request.query.code);
  
    const idToken = jwt.decode(accessToken.id_token);
  
    const userID = idToken.sub;
  
    console.log(idToken);
  
    // `userEmail` and `userName` will only be provided for the initial authorization with your app
    const userEmail = idToken.email;
    const userName = `${request.query.firstName} ${request.query.lastName}`;
  
    // 👷🏻‍♀️ TODO: Use the values provided create a new session for the user in your system
    const sessionID = `NEW SESSION ID for ${userID} / ${userEmail} / ${userName}`;
  
    console.log(`sessionID = ${sessionID}`);
  
    response.json({ sessionId: sessionID });
}

module.exports = {
    googleAuth,
    callbackApple,
    signInWithApple
}