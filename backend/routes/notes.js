const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");

// Import the body and validationResult functions from express-validator
const { body, validationResult } = require("express-validator");

//ROUTE 1: Get all the notes of user using : GET "/api/auth/createuser". login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    // Handle any errors that may occur
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//ROUTE 2: add a new notes of user using : GET "/api/auth/createuser". login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "description must be 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // Add the async keyword to the callback function
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      // Handle any errors that may occur
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 3: Update an existing Note using : PUT "/api/notes/updatenote". login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to updated and update it
    let note = await Note.findById(req.params.id);
    if (note?.user?.toString() !== req.user.id) {
      // Your code here
      return res.status(401).send("Not allowed");
    } else if (!note) {
      return res.status(404).send("Not Found");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    // Handle any errors that may occur
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//ROUTE 4: Delete an existing Note using : Delete "/api/notes/deletenote". login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //find the note to deleted and delete it
    let note = await Note.findById(req.params.id);
    if (note?.user?.toString() !== req.user.id) {
      // Your code here
      return res.status(401).send("Not allowed");
    } else if (!note) {
      return res.status(404).send("Not Found");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json("Successfully deleted");
  } catch (error) {
    // Handle any errors that may occur
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
