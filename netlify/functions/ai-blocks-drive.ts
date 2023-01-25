import { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async ({ headers: requestHeaders }: HandlerEvent) => {

  const blocksDomain = "https://playground.raise.mit.edu/";
  const { Origin } = requestHeaders;

  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET',
  };

  const headers = { ...CORS, 'Content-Type': 'application/json' };

  return Origin?.startsWith(blocksDomain)
    ? {
      headers,
      statusCode: 200,
      body: JSON.stringify({
        appId: process.env.DRIVE_APP_ID,
        clientId: process.env.DRIVE_CLIENT_ID,
        developerKey: process.env.DEVELOPER_KEY,
      }),
    }
    : {
      headers,
      statusCode: 400,
      body: JSON.stringify({ error: "Bad request to key server. If developing locally, opt to use your own, local keys." }),
    }
};

export { handler };