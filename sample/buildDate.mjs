import fs from 'fs';
import path from 'path';

const { sep } = path;

const execLocaltion = process.argv[1].split(sep);
execLocaltion.pop();
execLocaltion.push('build');
execLocaltion.push('buildDate.json');
const jsonPath = execLocaltion.join(sep);

const stream = {
    date: (new Date()).toGMTString(),
};

fs.writeFile(jsonPath, JSON.stringify(stream), (err) => {
    // eslint-disable-next-line no-console
    if (err) console.log('buildDate error:', err);
});
