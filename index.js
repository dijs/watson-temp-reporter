const sensor = require('ds18b20-raspi');
const createQueue = require('siju');
const debug = require('debug');
const report = require('./report');

const log = debug('Watson Temp Reporter');
const reportingIntervalTime = 1000 * 60 * 2;
const sensorList = sensor.list();
const queue = createQueue(report);

if (sensorList.length === 0) {
  log('No sensors found');
  process.exit();
}

function getReading() {
  const sensorReadings = sensor.readAllC();
  if (sensorReadings.length === 0) {
    log('No sensors readings');
    return null;
  }
  const temp = sensorReadings[0].t;
  const data = { temp, time: new Date(), location: 'Outside' };
  log('Received data', data);
}

function takeReading() {
  const reading = getReading();
  if (reading) {
    queue.add(reading);
  }
}

setInterval(takeReading, reportingIntervalTime);

log('Started Temp Reporter');

module.exports = () => {
  const reading = getReading();
  if (reading) {
    report(reading);
  }
};