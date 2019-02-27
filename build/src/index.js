"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlparser2_1 = require("htmlparser2");
function escape(src, quote) {
    return quote === "'" /* SINGLE */ ?
        src.replace(/'/g, "\\'") :
        src.replace(/"/g, '\\"');
}
exports.escape = escape;
function transform(html, quote = "'" /* SINGLE */, indent = 2) {
    let output = [], level = 0, dotmode = false;
    const onopentag = (name, attribs) => {
        let classList = [], attributeList = [], tag = name;
        if ('script' === name.toLowerCase()) {
            dotmode = true;
        }
        for (let key in attribs) {
            switch (key.toLowerCase()) {
                case 'class':
                    classList = attribs[key].split(' ').map(s => '.' + s);
                    continue;
                case 'id':
                    tag += '#' + attribs[key];
                    continue;
            }
            const val = `${quote}${escape(attribs[key], quote)}${quote}`;
            if (/^[\w-]+$/.test(key)) {
                attributeList.push({ key, val });
            }
            else {
                attributeList.push({
                    key: `${quote}${escape(key, quote)}${quote}`,
                    val
                });
            }
        }
        tag += classList.join('');
        if (attributeList.length) {
            tag += `(${attributeList
                .map(({ key, val }) => `${key}=${val}`)
                .join('')})`;
        }
        tag = tag.replace(/^div([\.#])/, '$1');
        output.push(' '.repeat(level * indent) + tag);
        level++;
    };
    const ontext = (text) => {
        let lines = text
            .split('\n')
            .map(s => dotmode ? s.replace(/^\s+$/, '') : s.trimLeft())
            .filter(s => s.length);
        if (!lines.length) {
            return;
        }
        if (dotmode) {
            let [_w] = lines[0].match(/^\s*/) || [''];
            if (_w.length) {
                lines = lines.map(s => s.replace(new RegExp('^' + _w), ''));
            }
            output[output.length - 1] += '.';
        }
        if (!dotmode && 1 === lines.length && output.length) {
            output[output.length - 1] += ` ${lines[0]}`;
        }
        else {
            output.push(lines
                .map(s => `${' '.repeat(level * indent)}${dotmode ? '' : '| '}${s}`)
                .join('\n'));
        }
    };
    const onclosetag = () => {
        dotmode = false;
        level--;
    };
    const parser = new htmlparser2_1.Parser({
        onopentag,
        ontext,
        onclosetag
    }, { decodeEntities: true });
    parser.write(html);
    parser.end();
    return output;
}
exports.transform = transform;
//# sourceMappingURL=index.js.map