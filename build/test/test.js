"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const index_1 = require("../src/index");
const html = fs_1.readFileSync(path_1.join(__dirname, '..', '..', 'test', 'data.html'), 'utf8');
const output = index_1.transform(html);
fs_1.writeFileSync(path_1.join(__dirname, '..', '..', 'test', 'data.pug'), output.join('\n'));
console.log(output);
//# sourceMappingURL=test.js.map