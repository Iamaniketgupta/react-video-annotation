import { useState } from "react";
import { FaMousePointer, FaRegSquare, FaRegCircle, FaSlash } from "react-icons/fa";

const basicColors = [
  { name: "Red", value: "#ff0000" },
  { name: "White", value: "#ffffff" },
  { name: "Green", value: "#00ff00" },
  { name: "Blue", value: "#0000ff" },
  { name: "Yellow", value: "#ffff00" },
  { name: "Magenta", value: "#ff00ff" },
  { name: "Cyan", value: "#00ffff" },
  { name: "Black", value: "#000000" },
];

function AnnotationTools({ selectedTool, setSelectedTool, annotationColor, setAnnotationColor }) {

  return (
    <>

      {/* Tool Buttons */}
      <div className="flex justify-center gap-2 bg-stone-700 p-2 rounded-full mb-4">
        <button
          className={`flex flex-col items-center text-white p-2 rounded-lg transition ${selectedTool === null ? "bg-stone-600" : "bg-stone-700"
            } hover:bg-stone-600`}
          onClick={() => setSelectedTool(null)}
        >
          <FaMousePointer size={18} />
        </button>

        <button
          className={`flex flex-col items-center text-white p-2 rounded-lg transition ${selectedTool === "rectangle" ? "bg-stone-600" : "bg-stone-700"
            } hover:bg-stone-600`}
          onClick={() => setSelectedTool("rectangle")}
        >
          <FaRegSquare size={18} />
        </button>

        <button
          className={`flex flex-col items-center text-white p-2 rounded-lg transition ${selectedTool === "circle" ? "bg-stone-600" : "bg-stone-700"
            } hover:bg-stone-600`}
          onClick={() => setSelectedTool("circle")}
        >
          <FaRegCircle size={18} />
        </button>

        <button
          className={`flex flex-col items-center text-white p-2 rounded-lg transition ${selectedTool === "line" ? "bg-stone-600" : "bg-stone-700"
            } hover:bg-stone-600`}
          onClick={() => setSelectedTool("line")}
        >
          <FaSlash size={18} />
        </button>


        {/* Color Picker */}
        <div className="bg-stone-700 p- rounded-xl ">
          <div className="flex items-center gap-3">
            <select
              value={annotationColor}
              onChange={(e) => setAnnotationColor(e.target.value)}
              className="bg-stone-800 outline-none text-white text-xs p-2 rounded-lg cursor-pointer"
            >
              {basicColors.map((color) => (
                <option key={color.value}  value={color.value} className="bg-stone-800">
                  {color.name}
                </option>
              ))}
            </select>
            <div
              className="w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: annotationColor }}
            ></div>
          </div>
        </div>
      </div>



    </>
  );
}

export default AnnotationTools;
