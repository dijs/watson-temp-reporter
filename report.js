const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./creds.json');

const startDay = new Date(2017, 8, 30);

const getDocument = key => new Promise(resolve => {
  const doc = new GoogleSpreadsheet(key);
  doc.useServiceAccountAuth(creds, () => resolve(doc));
});

const getSheet = (doc, n = 0) => new Promise((resolve, reject) => {
  doc.getInfo((err, info) => {
    if (err) {
      return reject(err);
    }
    return resolve(info.worksheets[n]);
  });
});

const getCell = (sheet, row, col) => new Promise((resolve, reject) => {
  sheet.getCells({
    'min-row': row,
    'max-row': row,
    'min-col': col,
    'max-col': col,
    'return-empty': true
  }, (err, cells) => {
    if (err) {
      return reject(err);
    }
    return resolve(cells[0]);
  });
});

const updateCell = (cell, value) => new Promise(resolve => {
  cell.value = value;
  cell.save(resolve);
});

const getRowByTime = time => {
  const date = new Date(time);
  // +2 For zero based index and then an extra row in the sheet
  return Math.round((date.getHours() * 60 + date.getMinutes()) / 20) + 2;
};

// +2 For zero based index and then an extra col in the sheet
const getColByDay = time => Math.floor((time - +startDay) / (1000 * 60 * 60 * 24)) + 2;

const report = ({ temp, time }) => {
  return getDocument('18U7JRwR8dCnt7EOvyaAu6uUEZJQIYDomb5kU05j9yW4')
    .then(doc => getSheet(doc))
    .then(sheet => getCell(sheet, getRowByTime(time), getColByDay(time)))
    .then(cell => updateCell(cell, temp));
}

module.exports = report;