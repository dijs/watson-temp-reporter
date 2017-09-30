const sensor = require('ds18b20-raspi');
const report = require('./report');

const reportingIntervalTime = 1000 * 60;
const sensorList = sensor.list();

if (sensorList.length === 0) {
  console.log('No sensors found');
  process.exit();
}

function takeReading() {
  const sensorReadings = sensor.readAllC();
  if (sensorReadings.length === 0) {
    console.log('No sensors readings');
    return;
  }
  const value = sensorReadings[0].t;
  report(value)
    .then(() => console.log(`Reported: ${value}`))
    .catch(console.error);
}

setInterval(takeReading, reportingIntervalTime);

console.log('Started Temp Reporter');
