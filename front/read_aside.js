const fs = require('fs');
const s = fs.readFileSync('src/app/components/chat/ChatSidebar.tsx','utf8');
const i = s.indexOf('<aside');
if(i>=0) console.log(s.substr(i,100));
else console.log('not found');
