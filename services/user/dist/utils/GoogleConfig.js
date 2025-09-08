import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
const CLIENT_ID = process.env.Google_Client_id;
const CLIENT_SECRET = process.env.Google_Client_secret;
export const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "postmessage");
//# sourceMappingURL=GoogleConfig.js.map