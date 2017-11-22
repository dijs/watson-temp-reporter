const jsonSql = require('json-sql')({ dialect: 'postgresql', namedValues: false });
const { Client } = require('pg');
const http = require('http');

const dbConnection = 'postgres://jhkmcahc:ydVCsgT1sSsrpH_Wx8WgrQvQUXOyY0S6@horton.elephantsql.com:5432/jhkmcahc';

const tableQuery = `
CREATE TABLE IF NOT EXISTS temps (
  "temp" DECIMAL,
  "time" TIMESTAMPTZ,
  "location" TEXT
)`;

const preformQuery = (...args) => {
  const client = new Client(dbConnection);
  return client
    .connect()
    .then(() => client.query(...args))
    .then(() => client.end());
}

preformQuery(tableQuery);

const report = ({ temp, time, location }) => {
  const sql = jsonSql.build({
    type: 'insert',
    table: 'temps',
    values: {
      temp,
      time,
      location
    }
  });
  const url = `http://richard.crushftp.com:5567/temp/${temp}/${location}/${time}`;
  http.get(url);
  return preformQuery(sql.query, sql.values);
}

module.exports = report;
