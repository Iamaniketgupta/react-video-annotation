import  { useState } from 'react'

export default function Settings() {
    const [lineWidth, setLineWidth] = useState(2);
    const [opacity, setOpacity] = useState(1);
  return (
    <div>
                <h2 className="text-white text-center text-xl font-semibold mb-4">Settings</h2>
        
      {/* Line Width Slider */}
      <div className="bg-stone-700 p-4 rounded-xl mb-4">
        <h3 className="text-white text-xs font-semibold mb-1">Stroke Width</h3>
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
          className="w-full accent-white"
        />
        <p className="text-white text-xs ">Width: {lineWidth}px</p>
      </div>

      {/* Opacity Slider */}
      <div className="bg-stone-700 p-4 rounded-xl">
        <h3 className="text-white text-xs font-semibold mb-1">Opacity</h3>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={opacity}
          onChange={(e) => setOpacity(e.target.value)}
          className="w-full accent-white"
        />
        <p className="text-white text-xs ">Opacity: {Math.round(opacity * 100)}%</p>
      </div>
    </div>
  )
}
