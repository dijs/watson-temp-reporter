const jsonSql = require('json-sql')({ dialect: 'postgresql', namedValues: false });
const { Client } = require('pg');
const http = require('http');

const tableQuery = `
CREATE TABLE IF NOT EXISTS temps (
  "temp" DECIMAL,
  "time" TIMESTAMPTZ,
  "location" TEXT
)`;

const preformQuery = (...args) => {
  const client = new Client(process.env.DB_CONNECTION);
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
  const url = `${process.env.REPORTING_SERVER}/temp/${temp}/${location}/${time}`;
  http.get(url);
  return preformQuery(sql.query, sql.values);
}

module.exports = report;