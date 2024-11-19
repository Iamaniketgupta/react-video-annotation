import { useRef, useState } from 'react'

import TwoDVideoAnnotation from '../../src/app/index';
import './App.css'

function App() {

  const myref = useRef(null);
  console.log(myref)
  const undo = () => {
    myref.current?.undo();
  }

  const redo = () => {
    myref.current?.redo();
  }

  const del = () => {
    myref.current?.deleteShape();
  }

  return (
    <div style={{ backgroundColor: "black", width: "100%", height: "100%" }}>

      <TwoDVideoAnnotation
        ref={myref}
        url="./video.mkv"
        shape="rectangle"
        hideAnnotations={false}
        videoWidth={640}
        lockEdit={false}
        annotationColor="blue"
        onSubmit={() => console.log("Data submitted")

        }
      />

      <button onClick={undo}>UNDO</button>
      <button onClick={redo}>REDO</button>
      <button onClick={del}>DELETE</button>
    </div>
  )
}

export default App
