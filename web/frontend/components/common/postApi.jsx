import axios from "axios";

import { getSessionToken } from "@shopify/app-bridge-utils";

async function postApi(url, body, app) {
  const sessionToken = await getSessionToken(app);

  const config = {
    headers: { Authorization: `Bearer ${sessionToken}` },
  };

  const response = await axios.post(url, body, config);

  return response;
}

export default postApi;
