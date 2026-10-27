const fs = require('fs');
const p = 'tsc_final2.txt';
try {
  const data = fs.readFileSync(p, 'utf8');
  const lines = data.split(/\r?\n/);
  console.log(lines.slice(-80).join('\n'));
} catch(e) { console.log('ERR'); }
