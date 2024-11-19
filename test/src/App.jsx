import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TwoDVideoAnnotation from './anno/index';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const myref = useRef(null);
  
  const undo =()=>{
    myref.current?.undo();
  }

  const redo =()=>{
    myref.current?.redo();
  }

  const del =()=>{
    myref.current?.deleteShape();
  }
  
  return (
    <div style={{ backgroundColor: "black", width: "100%", height: "100%" }}>

      <TwoDVideoAnnotation
        ref={myref}
        videoUrl="x.mp4"
        shape="rectangle"
        hideAnnotations={false}
        videoWidth={640}
        lockEdit={false}
        annotationColor="pink"
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
