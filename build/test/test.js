"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const index_1 = require("../src/index");
const assert_1 = require("assert");
const input = fs_1.readFileSync(path_1.join(__dirname, '..', '..', 'test', 'data.html'), 'utf8');
const expected = fs_1.readFileSync(path_1.join(__dirname, '..', '..', 'test', 'data.pug'), 'utf8');
const actual = index_1.transform(input).join('\n');
assert_1.strictEqual(actual, expected);
//# sourceMappingURL=test.js.map