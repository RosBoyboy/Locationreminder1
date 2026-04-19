const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  let list = []; try { list = fs.readdirSync(dir); } catch (e) { if (e.code === "ENOENT") return []; throw e; }
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = [...walk('./views'), ...walk('./components')];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/bg-indigo-50 dark:bg-indigo-500 hover:bg-indigo-600 text-white/g, 'bg-indigo-500 hover:bg-indigo-600 text-white');
  content = content.replace(/bg-indigo-50 dark:bg-indigo-500\nhover:bg-indigo-600 text-white/g, 'bg-indigo-500\nhover:bg-indigo-600 text-white');
  content = content.replace(/bg-indigo-50 dark:bg-indigo-500/g, 'bg-indigo-500');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
}



