const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '779352875569-20e6526rm38rh0h9c22dee74j30pbfdi.apps.googleusercontent.com'

const client = new OAuth2Client(CLIENT_ID);

const validarGoogleIdToken = async (token) => {
    
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                CLIENT_ID,
                '779352875569-ekbvkgeit8v5mons7s2ttirb307q0mt5.apps.googleusercontent.com',
                '779352875569-rg24f8252ajrf232vccsi0vov4s0k7tp.apps.googleusercontent.com'
            ],
        });
        const payload = ticket.getPayload();
        // const userid = payload['sub'];
        console.log(payload);
    
        return {
            name: payload['name'],
            picture: payload['picture'],
            email: payload['email'],
        }
    } catch (error) {
        return null;
    }

}

module.exports = {
    validarGoogleIdToken
}