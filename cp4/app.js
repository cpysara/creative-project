"use strict";

const fs = require("fs").promises;
const express = require("express");
const multer = require("multer");
const app = express();

app.use(multer().none());
app.use(express.static("public"));

app.get("/notes/all", async function(req, res) {
  try {
    let contents = await fs.readFile("notes.json", "utf8");
    let notes = JSON.parse(contents);
    res.json(notes);
  } catch (err) {
    res.status(400).json({"Error": "Fail to find the requested note."});
  }
});

app.get("/notes/:id", async function(req, res) {
  let found = false;
  try {
    let contents = await fs.readFile("notes.json", "utf8");
    let notes = JSON.parse(contents);
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === parseInt(req.params.id)) {
        res.json(notes[i]);
        found = true;
      }
    }
    if (!found) {
      res.status(400).json({"Error": "No note with id = " + req.params.id});
    }
  } catch (err) {
    res.status(400).json({"Error": "Fail to find the requested note."});
  }
});

app.post("/add-note", async function(req, res) {
  res.type("text");
  try {
    let contents = await fs.readFile("notes.json");
    let notes = JSON.parse(contents);
    let newNote = {
      id: parseInt(req.body.id),
      title: req.body.title,
      content: req.body.content
    };
    notes.push(newNote);
    let newNotesJson = JSON.stringify(notes);
    await fs.writeFile("notes.json", newNotesJson, "utf8");
    res.send("Successfully add the note.");
  } catch (err) {
    res.status(400).send("Error: Fail to add the note.");
  }
});

app.post("/remove-note", async function(req, res) {
  res.type("text");
  let found = false;
  let index = 0;
  try {
    let contents = await fs.readFile("notes.json");
    let notes = JSON.parse(contents);
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id === parseInt(req.body.id)) {
        found = true;
        index = i;
      }
    }
    if (!found) {
      res.status(400).send("Error: No note with id = " + req.body.id);
    } else {
      notes.splice(index, 1);
      let newNotesJson = JSON.stringify(notes);
      await fs.writeFile("notes.json", newNotesJson, "utf8");
      res.send("Successfully remove the selected note.");
    }
  } catch (err) {
    res.status(400).send("Error: Fail to remove the selected note.");
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);
