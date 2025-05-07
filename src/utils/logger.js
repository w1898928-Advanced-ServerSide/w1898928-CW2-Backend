const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/log.json');

if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath));
}

function logToFile(data) {
  const logEntry = { timestamp: new Date().toISOString(), ...data };
  fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + ',\n');
  console.log(logEntry); 
}

module.exports = { logToFile };
