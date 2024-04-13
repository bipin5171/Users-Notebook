import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
 const host = "http://localhost:5000"
const notesInitial = [
 
]
const [notes, setNotes] = useState(notesInitial)
//Get all Note
const  getNotes= async() =>{
  const response = await fetch(`${host}/api/notes/fetchallnotes`,{
    method:'GET',
    headers: {
      'Content-Type': 'application/json',
      "auth-token": localStorage.getItem('token')
    }

  }) ;
  const json = await response.json()
  console.log(json)   
  setNotes(json) 
}
//Add a Note
const addNote = async(title, description, tag) =>{
  const response = await fetch(`${host}/api/notes/addnote`,{
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
      "auth-token": localStorage.getItem('token')
    },
    body: JSON.stringify({title, description, tag})
  }) ;
  const json = await response.json();
  console.log(json);

      console.log("Adding a new note");
      const note =   {
        "_id": "65bf16a7f0c4d85bbeb93a94",
        "user": "65ac94a65dfcf51ebc8396cf",
        "title": title,
        "description": description,
        "tag": tag,
        "timstamp": "1707021991240",
        "__v": 0
      }
       //setNotes(notes.push(note));
       //setNotes([...notes, note]);
       //setNotes(notes.push(note));
       setNotes([...notes, note]);

      }
//Delete a Note
const deleteNote = async (id) =>{

   //API call
   const response = await fetch(`${host}/api/notes/deletenote/${id}`,{
    method:'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "auth-token": localStorage.getItem('token')
    }
  }) ;
  const json = response.json();
  console.log(json);
  
   console.log("deleting the node with the id"+id);
   const newNotes = notes.filter((note)=>{return note._id!==id})
   setNotes(newNotes)
}

//edit a Note

const editNote = async (id, title, description, tag) => {
  //API call
  const response = await fetch(`${host}/api/notes/updatenote/${id}`,{
    method:'PUT',
    headers: {
      'Content-Type': 'application/json',
      "auth-token": localStorage.getItem('token')
    },
    body: JSON.stringify({title,description,tag})
  }) ;
  const json = response.json();
  console.log(json);

  //Logic to edit in client
  let newNotes = JSON.parse(JSON.stringify(notes))
  for(let index = 0; index < notes.length; index++){
    const element = notes[index];
    if(element._id === id){
      newNotes[index].title = title;
      newNotes[index].description = description;
      newNotes[index].tag = tag;
      break;
    }
    
   }
   setNotes(newNotes);
}


  return (
   
    <NoteContext.Provider value={{notes, setNotes, addNote, deleteNote, editNote,getNotes}}>{props.children}</NoteContext.Provider>
  );
};

export default NoteState;
