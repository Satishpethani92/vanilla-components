/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.REACT_EMBEDDABLE_API_KEY;
const connectionName = 'my-csdb';

const BASE_URL = 'https://api.us.embeddable.com'; // US
// const BASE_URL = 'https://api.eu.embeddable.com'; // EU

/**
 * see db-specific examples @ https://trevorio.notion.site/Connections-API-ff4af10f7eaf4288b6952fde04e6e933
 */
const dbType = 'mysql'; // or bigquery, etc.
const credentials = {
  database: config.REACT_DB_NAME,
  host: config.REACT_DB_HOST,
  user: config.REACT_DB_USER,
  password: config.REACT_DB_PASSWORD,
};

async function run() {
  const resp = await fetch(`${BASE_URL}/api/v1/connections`, {
    method: 'POST', // POST = CREATE
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}` /* keep your API Key secure */,
    },
    body: JSON.stringify({
      name: `${connectionName}`,
      type: dbType,
      credentials: credentials,
    }),
  });

  console.log(`${resp.status} ${resp.statusText}`);
  const json = await resp.json();
  console.log(json);
}

run();
