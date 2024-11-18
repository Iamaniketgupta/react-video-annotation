import { useState } from "react";
import AnnotationTools from "./components/AnnotationTools";
import Settings from "./components/Settings";
import Tools from "./components/Tools";
import VideoPlayer from "./components/videoPlayer";
import { CiSettings } from "react-icons/ci";
import DataForm from "./components/DataForm";
import AnnotationsList from "./components/AnnotationsList";

function App() {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <div className="w-screen h-screen bg-stone-900 overflow-hidden flex flex-col">


      {/* Tools */}
      <div className=" rounded-full mt-4 flex items-center justify-between w-[95%] mx-auto h-14 bg-stone-800 px-4 shadow-md">
        <Tools />
      </div>

      <div className="flex flex-row gap-3 h-full w-[99%] my-2 mx-2">
        {/* Video Player */}
        <div className="bg-stone-900 flex-1 rounded-3xl shadow-lg m-2 p-4 overflow-auto">
          <VideoPlayer />
        </div>



        {/* Annotation Tools */}
        <div className="relative bg-stone-800 w-[400px] rounded-3xl shadow-lg m-2  pt-4 px-4  overflow-auto">
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
                <AnnotationTools />

                {/* Data Form */}
                <DataForm/>

                {/* Annotation List */}
                <AnnotationsList/>

              </>
          }
        </div>
      </div>


    </div>
  );
}

export default App;
