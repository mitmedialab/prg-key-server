import { Handler, HandlerEvent } from "@netlify/functions";
import { encryptAll, obscureTraffic } from "../../utils";
import { URLParameters } from "../../endpoints/ai-blocks/drive";

const handler: Handler = async ({ headers: requestHeaders, queryStringParameters }: HandlerEvent) => {
  const blocksDomain = "https://playground.raise.mit.edu/";
  const { Origin } = requestHeaders;

  const { session } = queryStringParameters as URLParameters;

  const { encrypt } = obscureTraffic(session);

  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, session',
    'Access-Control-Allow-Methods': 'GET',
  };

  const headers = { ...CORS, 'Content-Type': 'application/json' };

  return Origin?.startsWith(blocksDomain) || true
    ? {
      headers,
      statusCode: 200,
      body: JSON.stringify(
        encryptAll({
          appId: process.env.DRIVE_APP_ID as string,
          clientId: process.env.DRIVE_CLIENT_ID as string,
          developerKey: process.env.DEVELOPER_KEY as string,
        }, encrypt)
      ),
    }
    : {
      headers,
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request to key server. If developing locally, opt to use your own, local keys." }),
    }
};

export { handler };