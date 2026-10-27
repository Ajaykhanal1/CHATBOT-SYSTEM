const fs = require('fs');
try {
  const data = fs.readFileSync('tsc_result.txt', 'utf8');
  const lines = data.split(/\r?\n/);
  console.log(lines.slice(-60).join('\n'));
} catch(e) {
  console.log('ERR', e.message);
}
