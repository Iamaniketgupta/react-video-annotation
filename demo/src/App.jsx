import { useRef, useState } from "react";
import AnnotationTools from "./components/AnnotationTools";
import Settings from "./components/Settings";
import Tools from "./components/Tools";
import { CiSettings } from "react-icons/ci";
import DataForm from "./components/DataForm";
import AnnotationsList from "./components/AnnotationsList";
import { TwoDVideoAnnotation } from "../../src/app";


// Example to access video controls
const videoControls = {
  // autoPlay: true,
  // loop: true
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  // Very important to pass the state
  const [allAnnotations, setAllAnnotations] = useState([]);  // it can have initialData as well from database

  const [annotationColor, setAnnotationColor] = useState("red");
  const [annotationData, setAnnotationData] = useState(null);


  const annotationRef = useRef(null);  // use ref to access the undo,redo and deleteShape functions

  const handleSelectAnnotationData = (data) => {
    setAnnotationData(data);

  };

  console.log(allAnnotations)

  return (
    <div className="w-screen h-screen bg-stone-900 overflow-hidden flex flex-col">

      {/* Tools */}
      <div className=" rounded-full mt-2 py-2 flex items-center justify-between w-[95%]  mx-auto h-14 bg-stone-800 px-4 shadow-md">
        <Tools annotationRef={annotationRef} />
      </div>

      <div className="flex flex-row gap-3  p-4 overflow-y-auto">
        {/* Video Player */}
        <div className="bg-stone-900 flex-1 rounded-3xl p-2  max-h-[85vh]">
          <div className="w-[90%] mx-auto ">

            <TwoDVideoAnnotation
              rootRef={annotationRef}
              shapes={allAnnotations}
              setShapes={setAllAnnotations}
              videoUrl="https://videos.pexels.com/video-files/6804117/6804117-sd_960_506_25fps.mp4"
              selectedShapeTool={selectedTool}
              hideAnnotations={false}
              annotationColor={annotationColor}
              videoControls={videoControls}
              lockEdit={false}
              initialAnnotationData={annotationData}
              selectedAnnotationData={(data) => handleSelectAnnotationData(data)}
            />
          </div>
        </div>



        {/* Annotation Tools */}
        <div className="relative bg-stone-800 w-[400px] rounded-3xl shadow-lg m-2  pt-4 px-4  overflow-y-auto"
          style={{ scrollbarWidth: "none" }}>
          <div className=" absolute top-4 right-4">

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`text-white ${showSettings ? "bg-blue-600" : "bg-stone-700"} hover:bg-blue-600 p-1 rounded-full transition`}
            >
              <CiSettings size={20} />
            </button>
          </div>
          {

            showSettings ? <Settings />
              : <>
                {/* Annotation Tools Content */}
                <h2 className="text-white text-center text-xl font-semibold mb-4">Annotation Tools</h2>

                <AnnotationTools selectedTool={selectedTool}
                  setSelectedTool={setSelectedTool}
                  annotationColor={annotationColor}
                  setAnnotationColor={setAnnotationColor}
                />

                {/* Data Form */}
                <DataForm annotationData={annotationData} setAllAnnotations={setAllAnnotations} />

                {/* Annotation List */}
                <AnnotationsList allAnnotations={allAnnotations} />

              </>
          }
        </div>
      </div>


    </div>
  );
}

export default App;
