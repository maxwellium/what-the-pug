import { readFileSync } from 'fs';
import { join } from 'path';
import { transform } from '../src/index';
import { strictEqual } from 'assert';


const input = readFileSync(
  join( __dirname, '..', '..', 'test', 'data.html' ),
  'utf8'
);
const expected = readFileSync(
  join( __dirname, '..', '..', 'test', 'data.pug' ),
  'utf8'
);
const actual = transform( input ).join( '\n' );

strictEqual( actual, expected );