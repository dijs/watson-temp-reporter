const sensor = require('ds18b20-raspi');
const createQueue = require('siju');
const debug = require('debug');
const report = require('./report');

const log = debug('Watson Temp Reporter');
const reportingIntervalTime = 1000 * 60;
const sensorList = sensor.list();
const queue = createQueue(report);

if (sensorList.length === 0) {
  log('No sensors found');
  process.exit();
}

function takeReading() {
  const sensorReadings = sensor.readAllC();
  if (sensorReadings.length === 0) {
    log('No sensors readings');
    return;
  }
  const temp = sensorReadings[0].t;
  const payload = { temp, time: new Date(), location: 'Outside' };
  queue.add(payload);
}

setInterval(takeReading, reportingIntervalTime);

log('Started Temp Reporter');
