
---

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


### Preview

![React Video Annotation Tool Preview]([(https://res.cloudinary.com/surajgsn/image/upload/v1733140148/rnfokhwh2zgyoqalpzqq.png)])

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
        videoUrl="https://videos.pexels.com/video-files/6804117/6804117-sd_960_506_25fps.mp4"
      />
    </div>
  );
}

export default App;

```


## API

### TwoDVideoAnnotation Props

| Prop                   | Type       | Default | Description                                                                 |
|------------------------|------------|---------|-----------------------------------------------------------------------------|
| `rootRef`              | `ref`      | -       | Ref to access methods (e.g., undo, redo, deleteShape).                     |
| `shapes`               | `array`    | `[]`    | List of all annotations.                                                   |
| `setShapes`            | `function` | -       | State setter to update annotations.                                        |
| `videoUrl`             | `string`   | -       | URL of the video to annotate.                                              |
| `selectedShapeTool`    | `string`   | -       | The currently selected shape tool ('rectangle' , 'circle' , 'line').                                         |
| `hideAnnotations`      | `boolean`  | `false` | Whether to hide all annotations.                                           |
| `annotationColor`      | `string`   | `"red"` | Color for new annotations.                                                 |
| `videoControls`        | `object`   | `{}`    | Video playback controls (`autoPlay`, `loop`, etc.).                        |
| `lockEdit`             | `boolean`  | `false` | Disable editing annotations.                                               |
| `initialAnnotationData`| `object`   | `null`  | Preload annotation data.                                                   |
| `selectedAnnotationData`| `function`| -       | Callback triggered when annotation is selected.                            |

---

### Developers

-  [Aniket Gupta](mailto:aniketgupta@example.com)  
-  [Suraj Singh](mailto:surajgsn07@example.com)

---

## License

This library is available under the [MIT License](https://opensource.org/licenses/MIT). 

---
