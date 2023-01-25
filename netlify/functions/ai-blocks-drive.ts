import { Handler, HandlerEvent } from "@netlify/functions";

const handler: Handler = async ({ headers: requestHeaders }: HandlerEvent) => {

  const blocksDomain = "https://playground.raise.mit.edu/";
  const { Origin } = requestHeaders;

  const headers = {
    'Access-Control-Allow-Origin': blocksDomain,
    'Access-Control-Allow-Methods': 'GET'
  };

  headers['Access-Control-Allow-Origin'] = "*";

  return Origin?.startsWith(blocksDomain) || true
    ? {
      statusCode: 200,
      body: JSON.stringify({
        appId: process.env.DRIVE_APP_ID,
        clientId: process.env.DRIVE_CLIENT_ID,
        developerKey: process.env.DEVELOPER_KEY,
      }),
      headers
    }
    : {
      statusCode: 400,
      body: "Bad request to key server. If developing locally, opt to use your own, local keys.",
    }
};

export { handler };