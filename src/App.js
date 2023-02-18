"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./Components/css/App.css");
const Header_1 = __importDefault(require("./Components/NoteComponents/Header"));
const Notes_1 = __importDefault(require("./Components/NoteComponents/Notes"));
function App() {
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "main" }, { children: [(0, jsx_runtime_1.jsx)(Header_1.default, {}), (0, jsx_runtime_1.jsx)(Notes_1.default, {})] })));
}
exports.default = App;
