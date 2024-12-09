
# React Video Annotation Tool

**React Video Annotation Tool** is a flexible and intuitive library to add annotations on videos in real-time. It supports a wide range of features including shape tools, annotation lists, undo/redo functionality, and more.

## Features

- Annotate videos with custom shapes and colors.
- Easily control video playback.
- Undo, redo, and delete shapes with simple methods.
- Manage annotations with a customizable list.
- Integrate directly with databases for saving/loading annotations.
- Responsive and styled UI for modern web apps.

---

- ### Keyboard Shortcuts for Improved Productivity

- **Ctrl + Z**: Undo the last action.  
- **Ctrl + Y**: Redo the undone action.  
- **Delete Button**: Remove selected shapes.
---

### Preview

![React Video Annotation Tool Preview](https://res.cloudinary.com/surajgsn/image/upload/v1733140148/rnfokhwh2zgyoqalpzqq.png)

---

### Links

- **Demo Site**: [View Live Demo](https://react-video-annotation.vercel.app )
- **GitHub Repository**: [View on GitHub](https://github.com/Iamaniketgupta/react-video-annotation.git)

---

## Installation

Install the package using npm or yarn:

```bash
npm install react-video-annotation-tool
```

---

## Usage



### App.js Example

```jsx
import { useRef, useState } from "react";
import { TwoDVideoAnnotation } from "react-video-annotation-tool";
import { FaUndo, FaRedo, FaTrash } from "react-icons/fa";

function App() {
  const annotationRef = useRef(null);
  const [allAnnotations, setAllAnnotations] = useState([]);

  return (
    <div className="app">
      {/* Toolbar */}
      <div className="tools">
        <button onClick={() => annotationRef.current?.undo()}>
          <FaUndo /> Undo
        </button>
        <button onClick={() => annotationRef.current?.redo()}>
          <FaRedo /> Redo
        </button>
        <button onClick={() => annotationRef.current?.deleteShape()}>
          <FaTrash /> Delete
        </button>
      </div>

      {/* Video Annotation Tool */}
      <TwoDVideoAnnotation
        rootRef={annotationRef}
        shapes={allAnnotations}
        setShapes={setAllAnnotations}
        selectedShapeTool={"rectangle"} 
        videoUrl="https://videos.pexels.com/video-files/6804117/6804117-sd_960_506_25fps.mp4"
      />
    </div>
  );
}

export default App;

```

  ## Shapes objects and properties examples, expected as initial Data array of shapes of objects if passed 

  ```js
// Example of initial data array with shape objects
const initialShapes = [
  {
    id: "rectangle1", // Unique identifier for the shape
    color: "blue", // Color of the annotation
    label: "My Rectangle", // Optional label for the shape
    data: {}, // Custom data for user-defined purposes
    properties: {
      type: "rectangle", // Shape type
      x: 13, // X-coordinate of the rectangle
      y: 5, // Y-coordinate of the rectangle
      width: 4, // Width of the rectangle
      height: 4, // Height of the rectangle
      startTime: 0, // Start time of the annotation (seconds)
      endTime: 0.5, // End time of the annotation (seconds)
      scaleX: 1, // Horizontal scale factor
      scaleY: 1, // Vertical scale factor
      screenHeight: 600, // Height of the annotation area
      screenWidth: 400, // Width of the annotation area
      strokeWidth: 2, // Stroke width for the rectangle
      opacity: 0.8, // Opacity of the rectangle
    },
  },
  {
    id: "circle1", // Unique identifier for the circle
    color: "red",
    label: "My Circle", // Optional label for the circle
    data: {}, 
    properties: {
      type: "circle", 
      x: 10,
      y: 15, 
      radius: 4, // Radius of the circle
      startTime: 1, 
      endTime: 1.5, 
      scaleX: 1, 
      scaleY: 1,
      screenHeight: 600, 
      screenWidth: 400, 
      strokeWidth: 2, 
      opacity: 0.8,
    },
  },
  {
    id: "line1", 
    color: "green", 
    label: "My Line", 
    data: {}, 
    properties: {
      type: "line",
      x: 20,
      y: 30, 
      points: [0, 0, 100, 0, 100, 100], // Array of points defining the line
      startTime: 2, 
      endTime: 2.5, 
      scaleX: 1, 
      scaleY: 1, 
      screenHeight: 600, 
      screenWidth: 400, 
      strokeWidth: 2, 
      opacity: 0.8, 
    },
  },
];

            
  ```

## API

### TwoDVideoAnnotation Props

| Prop                   | Type       | Default | Description                                                                 |
|------------------------|------------|---------|-----------------------------------------------------------------------------|
| `rootRef`              | `ref`      | -       | Ref to access methods (e.g., undo, redo, deleteShape).                     |
| `shapes`               | `array`    | `[]`    | Initial array of annotations.                                                   |
| `setShapes`            | `function` | -       | State setter to update annotations.                                        |
| `videoUrl`             | `string`   | -       | URL of the video to annotate.                                              |
| `selectedShapeTool`    | `string`   | -       | The currently selected shape tool ('rectangle' , 'circle' , 'line').                                         |
| `hideAnnotations`      | `boolean`  | `false` | Whether to hide all annotations.                                           |
| `annotationColor`      | `string`   | `"red"` | Color for new annotations.                                                 |
| `videoControls`        | `object`   | `{}`    | Video playback controls ({`autoPlay:true`, `loop:true`}, etc.).                        |
| `lockEdit`             | `boolean`  | `false` | Disable editing annotations.                                               |
| `selectedAnnotationData`| `function`| -       | Callback triggered when annotation is selected.                            |

---

### Developers

-  [Aniket Gupta](mailto:iamaniketgupta1245@gmail.com)  
-  [Suraj Singh](mailto:surajgsn07@gmail.com)

---

## License

This library is available under the [MIT License](https://opensource.org/licenses/MIT). 


