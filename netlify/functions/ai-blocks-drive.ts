import { Handler, HandlerEvent } from "@netlify/functions";
import { encryptAll, obscureTraffic } from "../../utils";

const handler: Handler = async ({ headers: requestHeaders }: HandlerEvent) => {
  const blocksDomain = "https://playground.raise.mit.edu/";
  const { Origin, session } = requestHeaders;

  const { encrypt } = obscureTraffic(session);

  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET',
  };

  const headers = { ...CORS, 'Content-Type': 'application/json' };

  return Origin?.startsWith(blocksDomain) || true
    ? {
      headers,
      statusCode: 200,
      body: JSON.stringify({
        ...encryptAll({
          appId: process.env.DRIVE_APP_ID as string,
          clientId: process.env.DRIVE_CLIENT_ID as string,
          developerKey: process.env.DEVELOPER_KEY as string,
        }, encrypt), session
      }),
    }
    : {
      headers,
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request to key server. If developing locally, opt to use your own, local keys." }),
    }
};

export { handler };