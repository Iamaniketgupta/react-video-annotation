// import React, { useState, useEffect } from 'react';
// import { Stage, Layer, Rect, Label, Tag, Text, Transformer } from 'react-konva';
// import { FaTimes } from 'react-icons/fa';
// import Player from '../hooks/Player';

// function Canvas() {
//   const [shapes, setShapes] = useState([]);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [newShape, setNewShape] = useState(null);
//   const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
//   const [hoveredShapeIndex, setHoveredShapeIndex] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const shapeRef = React.useRef([]);
//   const transformerRef = React.useRef();

//   const handleMouseDown = (e) => {
//     const stage = e.target.getStage();
//     console.log('fad')
//     const { x, y } = stage.getPointerPosition();
//     const startTime = Player().getCurrentTime();
//     console.log(startTime)
//     if (!startTime) return;
//     setNewShape({ type: 'rectangle', x, y, width: 0, height: 0, startTime, endTime: startTime + 1 });
//     setIsDrawing(true);
//   };

//   const handleMouseMove = (e) => {
//     if (!isDrawing || !newShape) return;
//     const stage = e.target.getStage();
//     const { x, y } = stage.getPointerPosition();
//     const width = x - newShape.x;
//     const height = y - newShape.y;
//     setNewShape({ ...newShape, width, height });
//   };

//   const handleMouseUp = () => {
//     if (newShape) {
//       setShapes([...shapes, newShape]);
//     }
//     setIsDrawing(false);
//     setNewShape(null);
//   };

//   const handleSelectShape = (index) => {
//     setSelectedShapeIndex(index);
//   };

//   const handleDeleteShape = (index) => {
//     const updatedShapes = shapes.filter((_, i) => i !== index);
//     setShapes(updatedShapes);
//     setSelectedShapeIndex(null);
//   };

//   const handleDragStart = (e) => {
//     const stage = e.target.getStage();
//     stage.container().style.cursor = 'move';
//     setIsDragging(true);


//   };

//   const handleDragEnd = (e, index) => {
//     const stage = e.target.getStage();
//     stage.container().style.cursor = 'default';
//     const { x, y } = e.target.position();
//     const updatedShapes = shapes.map((shape, i) =>
//       i === index ? { ...shape, x, y } : shape
//     );
//     setShapes(updatedShapes);
//     setIsDragging(false);
//   };

//   useEffect(() => {
//     if (selectedShapeIndex !== null) {
//       const shape = shapeRef.current[selectedShapeIndex];
//       if (shape) {
//         transformerRef.current.nodes([shape]);

//         transformerRef.current.getLayer().batchDraw();
//       }
//     } else {
//       transformerRef.current.nodes([]);
//     }
//   }, [selectedShapeIndex]);

//   return (

//     <Stage
//       width={"100%"}
//       // height={"100%"}
//       height={window.innerHeight}
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         zIndex: 2,
       
//         backgroundColor: 'black'
//       }}
//       onClick={(e) => console.log("fad")}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}

//     >
//       <Layer>
//         {shapes.map((shape, i) => {
//           const isSelected = selectedShapeIndex === i;
//           const isHovered = hoveredShapeIndex === i;

//           return (
//             <React.Fragment key={i}>
//               <Rect
//                 ref={(el) => (shapeRef.current[i] = el)}
//                 x={shape.x}
//                 y={shape.y}
//                 width={shape.width}
//                 height={shape.height}
//                 fill="rgba(0, 128, 0, 0.1)"
//                 stroke="rgba(0, 128, 0, 0.3)"
//                 draggable
//                 onClick={() => handleSelectShape(i)}
//                 onMouseEnter={() => setHoveredShapeIndex(i)}
//                 onMouseLeave={() => setHoveredShapeIndex(null)}
//                 onDragStart={handleDragStart}
//                 onDragEnd={(e) => handleDragEnd(e, i)}
//               />
//               {((isSelected || isHovered) && !isDragging) && (
//                 <Label
//                   x={shape.x + shape.width / 2}
//                   y={shape.y - 2}
//                   opacity={0.9}
//                 >
//                   <Tag
//                     fill="black"
//                     pointerDirection="down"
//                     pointerWidth={8}
//                     pointerHeight={8}
//                     lineJoin="round"
//                   />
//                   <Text
//                     text={`Shape ${i + 1}`}
//                     fontFamily="Calibri"
//                     fontSize={10}
//                     padding={4}
//                     paddingX={6}
//                     fill="white"
//                   />
//                 </Label>
//               )}
//               {isSelected && (
//                 <FaTimes
//                   className="absolute cursor-pointer text-red-500"
//                   style={{
//                     left: shape.x + shape.width - 10,
//                     top: shape.y - 10,
//                     zIndex: 10,
//                   }}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDeleteShape(i);
//                   }}
//                 />
//               )}
//             </React.Fragment>
//           );
//         })}
//         {newShape && (
//           <Rect
//             x={newShape.x}
//             y={newShape.y}
//             width={newShape.width}
//             height={newShape.height}
//             stroke="green"
//             opacity={0.5}
//           />
//         )}
//         <Transformer
//           ref={transformerRef}
//           keepRatio={false}
//           anchorStyleFunc={(anchor) => {
//             anchor.cornerRadius(10);
//             if (anchor.hasName('top-center') || anchor.hasName('bottom-center')) {
//               anchor.height(6);
//               anchor.offsetY(3);
//               anchor.width(30);
//               anchor.offsetX(15);
//             }
//             if (anchor.hasName('middle-left') || anchor.hasName('middle-right')) {
//               anchor.height(30);
//               anchor.offsetY(15);
//               anchor.width(6);
//               anchor.offsetX(3);
//             }
//           }}
//         />
//       </Layer>
//     </Stage>

//   );
// }

// export default Canvas;

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Stage, Layer, Rect, Label, Tag, Text, Transformer } from 'react-konva';
import { FaTimes } from 'react-icons/fa';




const Rectangle = ({ x, y, width, height, color="red", scaleX, scaleY }) => (
  <Rect
    x={x * scaleX}
    y={y * scaleY}
    width={width * scaleX}
    height={height * scaleY}
    shadowBlur={5}
    stroke={color}
    strokeWidth='4'
  />
);

const CircleShape = ({ x, y, radius, color, scaleX, scaleY }) => (
  <Circle
    x={x * scaleX}
    y={y * scaleY}
    radius={radius * Math.min(scaleX, scaleY)}
    fill={color}
    shadowBlur={5}
  />
);


function Canvas({ getCurrentTime , videoRef , scale }) {
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [hoveredShapeIndex, setHoveredShapeIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentTime)
  const shapeRef = useRef([]);
  const transformerRef = useRef();

  

  const handleMouseDown = useCallback((e) => {
    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition();
    const startTime = currentTime;
    console.log({startTime})
    console.log({shapes})
    setNewShape({ type: 'rectangle', x, y, width: 0, height: 0, startTime, endTime: startTime + 2 });
    setIsDrawing(true);
  }, [currentTime]);

  
  const handleMouseMove = useCallback((e) => {
    if (!isDrawing || !newShape) return;
    const stage = e.target.getStage();
    const { x, y } = stage.getPointerPosition();
    const width = x - newShape.x;
    const height = y - newShape.y;
    setNewShape({ ...newShape, width, height });
  }, [isDrawing, newShape]);

  const handleMouseUp = useCallback(() => {
    if (newShape) {
      setShapes((prevShapes) => [...prevShapes, newShape]);
    }
    setIsDrawing(false);
    setNewShape(null);
  }, [newShape]);

  const handleSelectShape = useCallback((index) => {
    setSelectedShapeIndex(index);
  }, []);

  const handleDeleteShape = useCallback((index) => {
    setShapes((prevShapes) => prevShapes.filter((_, i) => i !== index));
    setSelectedShapeIndex(null);
  }, []);

  const handleDragEnd = useCallback((e, index) => {
    const { x, y } = e.target.position();
    setShapes((prevShapes) =>
      prevShapes.map((shape, i) => (i === index ? { ...shape, x, y } : shape))
    );
    setIsDragging(false);
  }, []);

  

  useEffect(() => {
    if (selectedShapeIndex !== null) {
      const shape = shapeRef.current[selectedShapeIndex];
      if (shape) {
        transformerRef.current.nodes([shape]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedShapeIndex]);

  
  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current.currentTime);
    };

    const video = videoRef.current;
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  
 
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ position: 'absolute', top: 0, left: 0 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
      {shapes
        .filter(annotation => currentTime >= annotation.startTime && currentTime <= annotation.endTime)
        .map((annotation, index) => {
          switch (annotation.type) {
            case 'rectangle':
              return <Rectangle key={index} {...annotation} scaleX={scale.scaleX} scaleY={scale.scaleY} />;
            case 'circle':
              return <CircleShape key={index} {...annotation} {...annotation} scaleX={scale.scaleX} scaleY={scale.scaleY} />;
            default:
              return null;
          }
        })}
        {newShape && (
          <Rect
            x={newShape.x}
            y={newShape.y}
            width={newShape.width}
            height={newShape.height}
            stroke="green"
            opacity={0.5}
          />
        )}
        <Transformer ref={transformerRef} keepRatio={false} />
      </Layer>
    </Stage>
  );
}

export default Canvas;
