"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// import {useState, useEffect } from "react";
const react_1 = require("react");
require("../css/Note.css");
const Note_1 = __importDefault(require("./Note"));
const CreateNote_1 = __importDefault(require("./CreateNote"));
const uuid_1 = require("uuid");
function Notes() {
    const [notes, setNotes] = (0, react_1.useState)([]);
    const [inputText, setInputText] = (0, react_1.useState)("");
    const textHandler = (e) => {
        setInputText(e.target.value);
    };
    const saveHandler = () => {
        setNotes((prevState) => [
            ...prevState,
            {
                id: (0, uuid_1.v4)(),
                text: inputText,
            },
        ]);
        //clear the textarea
        setInputText("");
    };
    const deleteNote = (id) => {
        const filteredNotes = notes.filter((note) => note.id !== id);
        setNotes(filteredNotes);
    };
    // Saving / Loading
    const firstMount = (0, react_1.useRef)(true);
    // Reading
    (0, react_1.useEffect)(() => {
        const json = localStorage.getItem("Notes");
        if (json) {
            const data = JSON.parse(json);
            // console.log("Reading", data);
            setNotes(data);
        }
    }, []);
    // Writing
    (0, react_1.useEffect)(() => {
        if (firstMount.current) {
            firstMount.current = false;
            return;
        }
        // console.log("Saving", JSON.stringify(notes));
        localStorage.setItem("Notes", JSON.stringify(notes));
    }, [notes]);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: "notes" }, { children: [notes.map((note) => ((0, jsx_runtime_1.jsx)(Note_1.default, { id: note.id, text: note.text, deleteNote: deleteNote }, note.id))), (0, jsx_runtime_1.jsx)(CreateNote_1.default, { textHandler: textHandler, saveHandler: saveHandler, inputText: inputText })] })));
}
exports.default = Notes;
