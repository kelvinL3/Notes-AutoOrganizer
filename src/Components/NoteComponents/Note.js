"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DeleteForeverOutlined_1 = __importDefault(require("@mui/icons-material/DeleteForeverOutlined"));
require("../css/Note.css");
function Note(props) {
    const { id, text, deleteNote } = props;
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "note" }, { children: [(0, jsx_runtime_1.jsx)("div", Object.assign({ className: "note__body" }, { children: text })), (0, jsx_runtime_1.jsx)("div", Object.assign({ className: "note__footer", style: { justifyContent: "flex-end" } }, { children: (0, jsx_runtime_1.jsx)(DeleteForeverOutlined_1.default, { className: "note__delete", onClick: () => deleteNote(id), "aria-hidden": "true" }) }))] })));
}
exports.default = Note;
