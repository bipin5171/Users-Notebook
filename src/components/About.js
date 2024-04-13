import React, { useContext, useEffect } from "react";
import noteContext from "../context/notes/NoteContext";

const About = () => {
  /* const a = useContext(noteContext)
  useEffect(()=>{
    a.update();
  },[])
*/
  // This is About {a.state.name} And he is in class {a.state.class} this inside return object
  return <div>This About page</div>;
};
export default About;
