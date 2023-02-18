"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
function CreateNote(params) {
    const { textHandler, saveHandler, inputText } = params;
    const charLimit = 100;
    const charLeft = charLimit - inputText.length;
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "note", style: { background: "rgba(255, 255, 255, 0)" } }, { children: [(0, jsx_runtime_1.jsx)("textarea", { cols: 10, rows: 5, value: inputText, placeholder: "Type....", onChange: textHandler, maxLength: 100 }), (0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "note__footer" }, { children: [(0, jsx_runtime_1.jsxs)("span", Object.assign({ className: "label" }, { children: [charLeft, " left"] })), (0, jsx_runtime_1.jsx)("button", Object.assign({ className: "note__save", onClick: saveHandler }, { children: "Save" }))] }))] })));
}
exports.default = CreateNote;
