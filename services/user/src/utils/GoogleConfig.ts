import {google} from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID=process.env.Google_Client_id as string;
const CLIENT_SECRET=process.env.Google_Client_secret as string;

export const oAuth2Client=new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    "postmessage"
)