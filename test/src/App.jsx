import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TwoDVideoAnnotation from './anno/index';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ backgroundColor: "black", width: "100%", height: "100%"}}>

      <TwoDVideoAnnotation
        videoUrl="./video.mkv"
        shape="rectangle"
        hideAnnotations={false}
        videoWidth={640}
        lockEdit={false}
        onSubmit={() => console.log("Data submitted")}
       />
    </div>
  )
}

export default App
