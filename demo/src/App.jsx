import { useRef, useState } from "react";
import AnnotationTools from "./components/AnnotationTools";
import Settings from "./components/Settings";
import Tools from "./components/Tools";
import VideoPlayer from "./components/videoPlayer";
import { CiSettings } from "react-icons/ci";
import DataForm from "./components/DataForm";
import AnnotationsList from "./components/AnnotationsList";
import TwoDVideoAnnotation from "../../src/app";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [annotationColor, setAnnotationColor] = useState("red");

  const playerRef = useRef(null);
  const val = [
    {
        "id": "20iz2qqhdcta0txnlumjeo",
        "color": "red",
        "label": "",
        "data": {},
        "properties": {
            "type": "rectangle",
            "x": 221.34973120101947,
            "y": 101.0265121459961,
            "width": 111.00157617226952,
            "height": 70,
            "startTime": 0.664162,
            "endTime": 1.1641620000000001,
            "scaleX": 1,
            "scaleY": 1,
            "screenHeight": 300,
            "screenWidth": 533
        }
    },
    {
        "id": "xhwgsthytkhaasqbkgst5",
        "color": "red",
        "label": "",
        "data": {},
        "properties": {
            "type": "rectangle",
            "x": 404.35232975530164,
            "y": 159.0265121459961,
            "width": 58.00082358551026,
            "height": 99,
            "startTime": 0.664162,
            "endTime": 1.1641620000000001,
            "scaleX": 1,
            "scaleY": 1,
            "screenHeight": 300,
            "screenWidth": 533
        }
    },
    {
        "id": "zpoqtr7oamromc3b71elie",
        "color": "red",
        "label": "",
        "data": {},
        "properties": {
            "type": "rectangle",
            "x": 55.34737404249023,
            "y": 184.0265121459961,
            "width": 104.0014767740183,
            "height": 51,
            "startTime": 0.664162,
            "endTime": 1.1641620000000001,
            "scaleX": 1,
            "scaleY": 1,
            "screenHeight": 300,
            "screenWidth": 533
        }
    },
    {
        "id": "kjkne0pdhuqmmuu6om7ze",
        "color": "red",
        "label": "",
        "data": {},
        "properties": {
            "type": "rectangle",
            "x": 193.34933360801452,
            "y": 92.0265121459961,
            "width": 103.00146257426812,
            "height": 57,
            "startTime": 2.059258,
            "endTime": 2.559258,
            "scaleX": 1,
            "scaleY": 1,
            "screenHeight": 300,
            "screenWidth": 533
        }
    },
    {
        "id": "ytn1y4764ufh9ckex368v",
        "color": "red",
        "label": "",
        "data": {},
        "properties": {
            "type": "rectangle",
            "x": 61.34745924099129,
            "y": 189.0265121459961,
            "width": 90.00127797751583,
            "height": 60,
            "startTime": 2.059258,
            "endTime": 2.559258,
            "scaleX": 1,
            "scaleY": 1,
            "screenHeight": 300,
            "screenWidth": 533
        }
    },
    {
        "id": "52ilxvaohpa7rauwkoqhpb",
        "color": "red",
        "label": "",
        "data": {},
        "properties": {
            "type": "rectangle",
            "x": 270.35042698877805,
            "y": 221.0265121459961,
            "width": 103.00146257426815,
            "height": 48,
            "startTime": 2.059258,
            "endTime": 2.559258,
            "scaleX": 1,
            "scaleY": 1,
            "screenHeight": 300,
            "screenWidth": 533
        }
    }
]

  return (
    <div className="w-screen h-screen bg-stone-900 overflow-hidden flex flex-col">


      {/* Tools */}
      <div className=" rounded-full mt-2 py-2 flex items-center justify-between w-[95%]  mx-auto h-14 bg-stone-800 px-4 shadow-md">
        <Tools playertools={playerRef}
        />
      </div>

      <div className="flex flex-row gap-3  p-4 overflow-y-auto">
        {/* Video Player */}
        <div className="bg-stone-900 flex-1 rounded-3xl p-2  max-h-[85vh]">
          <div className="w-[90%] mx-auto ">

          <TwoDVideoAnnotation
            ref={playerRef}
            videoUrl="https://videos.pexels.com/video-files/6804117/6804117-sd_960_506_25fps.mp4"
            selectedShapeTool={selectedTool}
            hideAnnotations={false}
            annotationColor={annotationColor}
            lockEdit={false}
            data={val}
            onSubmit={() => { }}
          />
          </div>
        </div>



        {/* Annotation Tools */}
        <div className="relative bg-stone-800 w-[400px] rounded-3xl shadow-lg m-2  pt-4 px-4  overflow-y-auto"
        style={{scrollbarWidth:"none"}}>
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
                <DataForm />

                {/* Annotation List */}
                {/* <AnnotationsList allAnnotations={playerRef.current?.shapes || []}/> */}

              </>
          }
        </div>
      </div>


    </div>
  );
}

export default App;
