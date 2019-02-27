import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { transform } from '../src/index';


const html = readFileSync(
  join( __dirname, '..', '..', 'test', 'data.html' ),
  'utf8'
);
const output = transform( html );

writeFileSync(
  join( __dirname, '..', '..', 'test', 'data.pug' ),
  output.join( '\n' )
);
console.log( output );