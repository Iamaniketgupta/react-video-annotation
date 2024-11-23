/* eslint-disable react/prop-types */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Stage,
  Layer,
  Rect,
  Transformer,
  Circle,
  Image,
  Text,
  Line,
} from "react-konva";
import { throttle } from "lodash";
import generateId from "../utils/generateId";
// import { redo, undo ,deleteShape} from "./utils";
import Player from "../VideoPlayer/Player";
import TransparentVideoController from "../VideoPlayerController/TransparentVideoplayerController";
import useVideoController from "../VideoPlayerController/UseVideoPlayerControllerHook";
/**
 * Rectangle component renders a rectangle shape on the canvas.
 *
 * @param {Object} properties - Shape properties (x, y, width, height).
 * @param {number} scaleX - Horizontal scale factor.
 * @param {number} scaleY - Vertical scale factor.
 * @param {string} color - Stroke color of the rectangle.
 * @param {boolean} draggable - If true, rectangle can be dragged.
 * @param {function} onClick - Function that handles click event.
 * @param {function} onDragEnd - Function that handles end of dragging.
 * @param {function} onDragStart - Function that handles start of dragging.
 * @param {function} onTransformEnd - Function to handle transformation end.
 * @param {React.Ref} ref - Reference for the rectangle.
 * @returns {JSX.Element} - Rendered rectangle.
 */
const Rectangle = forwardRef(
  (
    {
      properties,
      scaleX,
      scaleY,
      color,
      draggable,
      onClick,
      onDragEnd,
      onDragStart,
      onTransformEnd,
      onTransformStart,
      onDragMove,
      dragBoundFunc,
      currentWidth,
      currentHeight,
      onMouseEnter,
    },
    ref
  ) => (
    <Rect
      ref={ref}
      x={properties.x * (currentWidth / properties.screenWidth)}
      y={properties.y * (currentHeight / properties.screenHeight)}
      width={properties.width * (currentWidth / properties.screenWidth)}
      height={properties.height * (currentHeight / properties.screenHeight)}
      shadowBlur={5}
      stroke={color}
      strokeWidth={2}
      draggable={draggable}
      onClick={onClick}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onMouseEnter={onMouseEnter}
      dragBoundFunc={dragBoundFunc}
      onTransformStart={onTransformStart}
      onTransformEnd={onTransformEnd}
    />
  )
);

Rectangle.displayName = "Rectangle";

/**
 * Circle component renders a circle shape on the canvas.
 *
 * @param {Object} properties - Shape properties (x, y, radius, screenWidth, screenHeight).
 * @param {number} scaleX - Horizontal scale factor.
 * @param {number} scaleY - Vertical scale factor.
 * @param {string} color - Stroke color of the circle.
 * @param {boolean} draggable - If true, circle can be dragged.
 * @param {function} onClick - Function that handles click event.
 * @param {function} onDragEnd - Function that handles end of dragging.
 * @param {function} onDragStart - Function that handles start of dragging.
 * @param {function} onTransformEnd - Function to handle transformation end.
 * @param {React.Ref} ref - Reference for the circle.
 * @returns {JSX.Element} - Rendered circle.
 */
const CircleShape = forwardRef(
  (
    {
      properties,
      scaleX,
      scaleY,
      color,
      draggable,
      onClick,
      onDragEnd,
      onDragStart,
      onTransformEnd,
      onTransformStart,
      onDragMove,
      dragBoundFunc,
      currentWidth,
      currentHeight,
      onMouseEnter,
    },
    ref
  ) => (
    <Circle
      ref={ref}
      x={properties.x * (currentWidth / properties.screenWidth)}
      y={properties.y * (currentHeight / properties.screenHeight)}
      radius={properties.radius * (currentWidth / properties.screenWidth)}
      stroke={color}
      strokeWidth={properties.strokeWidth || 2}
      draggable={draggable}
      onClick={onClick}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onMouseEnter={onMouseEnter}
      dragBoundFunc={dragBoundFunc}
      onTransformStart={onTransformStart}
      onTransformEnd={onTransformEnd}
    />
  )
);

/**
 * Line component renders a line shape on the canvas.
 *
 * @param {Object} properties - Shape properties (x, y, points, tension, strokeWidth, screenWidth, screenHeight).
 * @param {string} color - Stroke color of the line.
 * @param {boolean} draggable - If true, line can be dragged.
 * @param {function} onClick - Function that handles click event.
 * @param {function} onDragEnd - Function that handles end of dragging.
 * @param {function} onDragStart - Function that handles start of dragging.
 * @param {function} onTransformEnd - Function to handle transformation end.
 * @param {React.Ref} ref - Reference for the line.
 * @returns {JSX.Element} - Rendered line.
 */
const LineShape = forwardRef(
  (
    {
      properties,
      color,
      draggable,
      onClick,
      onDragEnd,
      onDragStart,
      onTransformEnd,
      onTransformStart,
      onDragMove,
      dragBoundFunc,
      currentWidth,
      currentHeight,
      onMouseEnter,
    },
    ref
  ) => (
    <Line
      ref={ref}
      x={properties.x * (currentWidth / properties.screenWidth)}
      y={properties.y * (currentHeight / properties.screenHeight)}
      points={properties.points.map((point, index) =>
        index % 2 === 0
          ? point * (currentWidth / properties.screenWidth)
          : point * (currentHeight / properties.screenHeight)
      )}
      tension={properties.tension || 0}
      stroke={color}
      strokeWidth={properties.strokeWidth || 2}
      draggable={draggable}
      onClick={onClick}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onMouseEnter={onMouseEnter}
      dragBoundFunc={dragBoundFunc}
      onTransformStart={onTransformStart}
      onTransformEnd={onTransformEnd}
    />
  )
);

/**
 * Canvas component manages the drawing and transformation of shapes.
 *
 * @param {function} getCurrentTime - Function to get the current time from the video.
 * @param {Object} scale - Scaling factors for the canvas (scaleX, scaleY).
 * @param {boolean} isFullScreen - Boolean to determine if in full-screen mode.
 * @returns {JSX.Element} - Rendered canvas with shapes.
 */
const Canvas = forwardRef(function Canvas(
  {
    children,
    url,
    selectedShapeTool,
    hideAnnotations,
    lockEdit,
    initialData,
    externalSetData,
    externalOnSubmit,
    annotationColor,
  },
  ref
) {
  // GENERAL STATES
  const [shapes, setShapes] = useState(initialData || []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [rectPosititon, setRectPosition] = useState({ x: null, y: null });
  const [videoRefVal, setVideoRefVal] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: 500,
    height: 300,
  });
  
  // REF STATES
  const shapeRef = useRef({});
  const transformerRef = useRef();
  const stageRef = useRef(null);
  const canvasParentRef = useRef(null);
  const layerRef = useRef(null);
  const videoRef = useRef(null);
  const konvaImageRef = useRef(null);

  // HOOK VALUES
  const { currentTime, setCurrentTime, isFullScreen } = useVideoController(
    videoRefVal,
    canvasParentRef
  );
  // STACK STATES
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [canvasParentWidth, setcanvasParentWidth] = useState(
    canvasParentRef?.current?.offsetWidth
  );
  const [canvasParentHeight, setcanvasParentHeight] = useState(
    canvasParentRef?.current?.offsetHeight
  );

  useEffect(() => {
    setVideoRefVal(videoRef);

    return () => {
      setVideoRefVal(null);
    };
  }, [videoRef]);
  /**
   * Handle mouse down event to start drawing a new shape.
   *
   * @param {Object} e - The mouse event object.
   */
  const handleMouseDown = useCallback(
    (e) => {
      if (isFullScreen) return;
      
    // Access cursor style of the document
    const cursor = window.getComputedStyle(document.body).cursor;

    console.log({cursor})
    if (cursor === "nwse-resize") return;

      const stage = e.target.getStage();
      if (!stage) return;
      const { x, y } = stage.getPointerPosition();
      const startTime = currentTime;
      let shapeProperties;

      switch (selectedShapeTool) {
        case "rectangle":
          shapeProperties = {
            type: "rectangle",
            x,
            y,
            width: 4, // Default width for rectangle
            height: 4, // Default height for rectangle
            startTime,
            endTime: startTime + 0.5,
            scaleX: 1,
            scaleY: 1,
            screenHeight: canvasParentHeight,
            screenWidth: canvasParentWidth,
          };
          break;

        case "circle":
          shapeProperties = {
            type: "circle",
            x,
            y,
            radius: 20, // Default radius for circle
            startTime,
            endTime: startTime + 0.5,
            scaleX: 1,
            scaleY: 1,
            screenHeight: canvasParentHeight,
            screenWidth: canvasParentWidth,
            strokeWidth: 2, // Default stroke width for circle
          };
          break;

        case "line":
          shapeProperties = {
            type: "line",
            x,
            y,
            points: [0, 0, 100, 0, 100, 100], // Default points for line
            startTime,
            endTime: startTime + 0.5,
            scaleX: 1,
            scaleY: 1,
            screenHeight: canvasParentHeight,
            screenWidth: canvasParentWidth,
            strokeWidth: 2, // Default stroke width for line
          };
          break;

        default:
          return; // If no valid shape is selected, do nothing
      }

      setNewShape({
        id: generateId(),
        color: annotationColor,
        label: "",
        data: {},
        properties: shapeProperties,
      });

      setIsDrawing(true);
    },
    [
      currentTime,
      isFullScreen,
      annotationColor,
      selectedShapeTool,
      canvasParentHeight,
      canvasParentWidth,
    ]
  );

  /**
   * Handle mouse move event to update the shape dimensions while drawing.
   *
   * @param {Object} e - The mouse event object.
   */

  const handleMouseMove = throttle((e) => {
    if (isFullScreen) return;
    if (!isDrawing || !newShape) return;

    const stage = e.target.getStage();
    if (!stage) return;
    const { x, y } = stage.getPointerPosition();

    // Exit early if there's no change in position
    if (x === newShape.properties.x && y === newShape.properties.y) return;

    // Switch case to update shape properties based on selected shape
    let updatedShape;

    switch (newShape.properties.type) {
      case "rectangle":
        const width = x - newShape.properties.x;
        const height = y - newShape.properties.y;

        updatedShape = {
          ...newShape,
          properties: {
            ...newShape.properties,
            width,
            height,
          },
        };
        break;

      case "circle":
        const radius = Math.sqrt(
          Math.pow(x - newShape.properties.x, 2) +
            Math.pow(y - newShape.properties.y, 2)
        );

        updatedShape = {
          ...newShape,
          properties: {
            ...newShape.properties,
            radius,
          },
        };
        break;

      case "line":
        // For line, we need to update the points
        const points = [
          0,
          0,
          x - newShape.properties.x,
          y - newShape.properties.y,
        ]; // Basic line path

        updatedShape = {
          ...newShape,
          properties: {
            ...newShape.properties,
            points,
          },
        };
        break;

      default:
        return;
    }

    setNewShape(updatedShape);
  }, 100);

  useEffect(() => {
    console.log(shapes)
  }, [shapes])
  
  /**
   * Handle mouse up event to finalize drawing and add the shape to the state.
   *
   * @param {Object} e - The mouse event object.
   */
  const handleMouseUp = useCallback(() => {
    if (newShape) {
      setHistory((prevHistory) => [...prevHistory, shapes]);
      setRedoStack([]);
      setShapes((prevShapes) => [...prevShapes, newShape]);
      setIsDrawing(false);
      setSelectedShapeId(newShape.id);
      setNewShape(null);
    }
  }, [newShape, shapes]);

  /**
   * Handle shape selection by setting the selected shape's ID.
   *
   * @param {string} shapeId - The unique ID of the clicked shape.
   * @param {Object} e - The click event object.
   */
  const handleSelectShape = useCallback((shapeId, e) => {
    e.cancelBubble = true;
    setSelectedShapeId(shapeId);
  }, []);

  /**
   * Handle shape deselection by setting the selected shape to null.
   *
   * @param {Object} e - The click event object.
   */
  const handleStageClick = (e) => {
    if (isFullScreen) return;

    if (e.target === e.target.getStage() || e.target.className === "Image") {
      setSelectedShapeId(null);
    }
  };

  /**
   * Handle shape deletion by filtering out the shape with the given ID.
   *
   * @param {string} shapeId - The ID of the shape to delete.
   */
  const deleteShape = useCallback(() => {
    setShapes((prevShapes) =>
      prevShapes.filter((shape) => shape.id !== selectedShapeId)
    );
    setSelectedShapeId(null);
  }, [selectedShapeId]);

  /**
   * Handle drag start event to change the cursor style.
   *
   * @param {Object} e - The event object.
   */
  const handleDragStart = (e) => {
    e.target.getStage().container().style.cursor = "move";
  };

  /**
   * Handle drag end event to update the shape's position.
   *
   * @param {Object} e - The event object.
   * @param {string} shapeId - The ID of the shape being dragged.
   */
  const handleDragEnd = useCallback(
    (e, shapeId) => {
      const { x, y } = rectPosititon;

      if (x !== null && y !== null) {
        setShapes((prevShapes) =>
          prevShapes.map((shape) =>
            shape.id === shapeId
              ? { ...shape, properties: { ...shape.properties, x, y } }
              : shape
          )
        );
      }
      e.target.getStage().container().style.cursor = "default";
    },
    [rectPosititon]
  );

  /**
   * Handle transform end event to update the shape's properties.
   *
   * @param {Object} e - The event object.
   * @param {string} shapeId - The ID of the shape being transformed.
   */

  const handleTransformStart = useCallback(() => {
    document.body.style.cursor = 'nwse-resize';     
    setHistory((prevHistory) => [...prevHistory, shapes]);
    setRedoStack([]);
  }, [shapes]);

  const handleTransformEnd = useCallback(
    (e, shapeId) => {
      
      
      document.body.style.cursor = 'auto';
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(1);
      node.scaleY(1);

      if (!isFullScreen) {
        setShapes((prevShapes) =>
          prevShapes.map((shape) => {
            if (shape.id !== shapeId) return shape;

            const { type } = shape.properties;

            let updatedProperties;
            switch (type) {
              case "rectangle":
                updatedProperties = {
                  ...shape.properties,
                  x: node.x(),
                  y: node.y(),
                  width: node.width() * scaleX,
                  height: node.height() * scaleY,
                };
                break;

              case "circle":
                updatedProperties = {
                  ...shape.properties,
                  x: node.x(),
                  y: node.y(),
                  radius: node.radius() * scaleX, // Assuming uniform scaling for radius
                };
                break;

              case "line":
                updatedProperties = {
                  ...shape.properties,
                  x: node.x(),
                  y: node.y(),
                  points: node
                    .points()
                    .map((point, index) =>
                      index % 2 === 0 ? point * scaleX : point * scaleY
                    ), // Scale points for the line
                };
                break;

              default:
                return shape; // No changes for unknown types
            }

            return {
              ...shape,
              properties: updatedProperties,
            };
          })
        );
      }
    },
    [isFullScreen]
  );

  /**
   * Handle UNDO.
   */
  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setRedoStack((prevRedoStack) => [shapes, ...prevRedoStack]);
      setShapes(lastState);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  }, [history, shapes]);

  /**
   * Handle REDO.
   */
  const redo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setHistory((prevHistory) => [...prevHistory, shapes]);
      setShapes(nextState);
      setRedoStack((prevRedoStack) => prevRedoStack.slice(1));
    }
  }, [redoStack, shapes]);

  /**
   * Set the data of the selected shape.
   * @param {Object} data - The data to be set.
   */
  const setSelectedAnnotationData = useCallback((data) => {
    if (!selectedShapeId) {
      throw new Error("Select a shape first");
    }

    const shape = shapes.find((shape) => shape.id === selectedShapeId);
    if (shape) {
      shape.properties.data = data;
      setShapes([...shapes]);
    }
  });

  /**
   * Get the data of the selected shape.
   * @returns {any} The data of the selected shape.
   */
  const getSelectedAnnotationData = useCallback(() => {
    if (!selectedShapeId) {
      throw new Error("Select a shape first");
    }
    const shape = shapes.find((shape) => shape.id === selectedShapeId);
    if (shape) {
      return shape?.properties?.data;
    }
  });

  useEffect(() => {
    setcanvasParentHeight(canvasParentRef?.current?.offsetHeight);
    setcanvasParentWidth(canvasParentRef?.current?.offsetWidth);
  }, [
    canvasParentRef?.current?.offsetHeight,
    canvasParentRef?.current?.offsetWidth,
  ]);

  /**
   * UNDO/REDO shortcut key events
   */

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        redo();
      }
      if (e.key === "Delete") {
        deleteShape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo, deleteShape]);

  /**
   * Synchronize the transformer with the selected shape when the selected shape changes.
   */
  useEffect(() => {
    if (selectedShapeId !== null && shapeRef.current[selectedShapeId]) {
      transformerRef.current.nodes([shapeRef.current[selectedShapeId]]);
      transformerRef.current.getLayer().batchDraw();
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedShapeId]);

  /**
   * Update current time when the video plays.
   */
  useEffect(() => {
    const handleTimeUpdate = () =>
      setCurrentTime(videoRef?.current?.currentTime);
    const video = videoRef.current;
    video?.addEventListener("timeupdate", handleTimeUpdate);
    return () => video?.removeEventListener("timeupdate", handleTimeUpdate);
  }, [videoRef]);

  const isVisible = useCallback(
    (shapeId) => {
      const shape = shapes.find((shape) => shape.id === shapeId);
      return (
        currentTime >= shape?.properties?.startTime &&
        currentTime <= shape?.properties?.endTime
      );
    },
    [currentTime, shapes]
  );

  useEffect(() => {
    if (!videoRef.current?.paused || lockEdit || !isVisible(selectedShapeId)) {
      setSelectedShapeId(null);
    }
  }, [
    videoRef.current?.paused,
    lockEdit,
    currentTime,
    isVisible,
    selectedShapeId,
  ]);

  // lo
  const dragBoundFunc = (pos) => {
    const newX = Math.max(
      0,
      Math.min(
        pos.x,
        dimensions.width - shapeRef.current[selectedShapeId].width()
      )
    );
    const newY = Math.max(
      0,
      Math.min(
        pos.y,
        dimensions.height - shapeRef.current[selectedShapeId].height()
      )
    );

    return { x: newX, y: newY };
  };
  const handleDragMove = (e) => {
    const newX = Math.max(
      0,
      Math.min(
        e.target.x(),
        dimensions.width - shapeRef.current[selectedShapeId].width()
      )
    );
    const newY = Math.max(
      0,
      Math.min(
        e.target.y(),
        dimensions.height - shapeRef.current[selectedShapeId].height()
      )
    );

    setRectPosition({ x: newX, y: newY });
  };

  useEffect(() => {
    const video = videoRef.current;
    const konvaImage = konvaImageRef.current;

    const updateCanvas = () => {
      if (konvaImage && video) {
        konvaImage.image(video);
        konvaImage.getLayer().batchDraw();
      }
      requestAnimationFrame(updateCanvas);
    };

    if (video) {
      updateCanvas();
    }

    video?.addEventListener("play", () => {
      video.play();
    });

    video?.addEventListener("pause", () => {
      video.pause();
    });

    return () => {
      video?.pause();
    };
  }, []);

  const [imagedim, setImgDim] = useState(dimensions);

  useEffect(() => {
    const updateSize = () => {
      if (canvasParentRef.current) {
        const { offsetWidth, offsetHeight } = canvasParentRef.current;
        setDimensions({
          width: offsetWidth,
          height: offsetHeight,
        });
        setImgDim({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useImperativeHandle(ref, () => ({
    shapes,
    undo,
    redo,
    deleteShape,
    setSelectedAnnotationData,
    getSelectedAnnotationData,
  }));

  const handleMouseEnterInStage = (e) => {
    if (!selectedShapeTool) {
      e.target.getStage().container().style.cursor = "pointer";
    } else {
      e.target.getStage().container().style.cursor = "crosshair";
    }
  };
  return (
    <>
      <div
        ref={canvasParentRef}
        style={{
          maxWidth: window.innerWidth,
          aspectRatio: "16/9",
          minHeight: 300,
          minWidth: 500,
        }}
      >
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{
            backgroundColor: "black",
            display: hideAnnotations ? "none" : "block",
          }}
          onMouseEnter={handleMouseEnterInStage}
          onMouseLeave={(e) =>
            (e.target.getStage().container().style.cursor = "default")
          }
          onMouseDown={
            !lockEdit && !isFullScreen && selectedShapeTool
              ? handleMouseDown
              : null
          }
          onMouseMove={
            !lockEdit && !isFullScreen && selectedShapeTool
              ? handleMouseMove
              : null
          }
          onMouseUp={
            !lockEdit && !isFullScreen && selectedShapeTool
              ? handleMouseUp
              : null
          }
          onClick={!isFullScreen ? (e) => handleStageClick(e) : null}
        >
          <Layer ref={layerRef}>
            <Image
              ref={konvaImageRef}
              image={videoRef?.current}
              width={imagedim.width}
              height={imagedim.height}
            />

            {/* {selectedShapeId &&
              (function () {
                const selectedShape = shapes.find(
                  (shape) => shape.id === selectedShapeId
                );
                if (selectedShape) {
                  const { x, y, radius, points } = selectedShape.properties;

                  // Calculate the position of the ❌ button based on the shape type
                  let buttonX = x;
                  let buttonY = y;

                  if (selectedShape.properties.type === "rectangle") {
                    buttonX += selectedShape.properties.width + 5; // For rectangle, use width
                    buttonY -= 15;
                  } else if (selectedShape.properties.type === "circle") {
                    buttonX += radius + 5; // For circle, use radius
                    buttonY -= 25;
                  } else if (
                    selectedShape.properties.type === "line" &&
                    points
                  ) {
                    // For line, calculate the end point
                    const [startX, startY, endX, endY] = points;
                    buttonX = endX ;
                    buttonY = endY ;
                  }

                  return (
                    <Text
                      text="❌"
                      x={buttonX}
                      y={buttonY}
                      fill="red"
                      strokeWidth={3}
                      shadowColor="white"
                      fontSize={10}
                      onClick={(e) => deleteShape(e)}
                    />
                  );
                }
                return null;
              })()} */}

            {shapes
              .filter(
                (shape) =>
                  currentTime >= shape.properties.startTime &&
                  currentTime <= shape.properties.endTime
              )
              .map((shape) => {
                switch (shape.properties.type) {
                  case "rectangle":
                    return (
                      <Rectangle
                        key={shape.id}
                        ref={(ref) => {
                          shapeRef.current[shape.id] = ref;
                        }}
                        {...shape}
                        scaleX={stageRef.current?.scaleX()}
                        scaleY={stageRef.current?.scaleY()}
                        onMouseEnter={handleMouseEnterInStage}
                        draggable={
                          !selectedShapeTool &&
                          !isFullScreen &&
                          !lockEdit &&
                          shape.id === selectedShapeId
                        }
                        onClick={
                          !lockEdit && !isFullScreen && !selectedShapeTool
                            ? (e) => handleSelectShape(shape.id, e)
                            : null
                        }
                        onDragEnd={
                          selectedShapeId
                            ? (e) => handleDragEnd(e, shape.id)
                            : null
                        }
                        onDragStart={selectedShapeId ? handleDragStart : null}
                        onDragMove={selectedShapeId ? handleDragMove : null}
                        dragBoundFunc={dragBoundFunc}
                        onTransformEnd={
                          selectedShapeId
                            ? (e) => handleTransformEnd(e, shape.id)
                            : null
                        }
                        onTransformStart={
                          selectedShapeId ? handleTransformStart : null
                        }
                        currentHeight={canvasParentHeight}
                        currentWidth={canvasParentWidth}
                      />
                    );
                  case "circle":
                    return (
                      <CircleShape
                        key={shape.id}
                        ref={(ref) => {
                          shapeRef.current[shape.id] = ref;
                        }}
                        {...shape}
                        scaleX={stageRef.current?.scaleX()}
                        scaleY={stageRef.current?.scaleY()}
                        onMouseEnter={handleMouseEnterInStage}
                        draggable={
                          !selectedShapeTool &&
                          !isFullScreen &&
                          !lockEdit &&
                          shape.id === selectedShapeId
                        }
                        onClick={
                          !lockEdit && !isFullScreen && !selectedShapeTool
                            ? (e) => handleSelectShape(shape.id, e)
                            : null
                        }
                        onDragEnd={
                          selectedShapeId
                            ? (e) => handleDragEnd(e, shape.id)
                            : null
                        }
                        onDragStart={selectedShapeId ? handleDragStart : null}
                        onDragMove={selectedShapeId ? handleDragMove : null}
                        dragBoundFunc={dragBoundFunc}
                        onTransformEnd={
                          selectedShapeId
                            ? (e) => handleTransformEnd(e, shape.id)
                            : null
                        }
                        onTransformStart={
                          selectedShapeId ? handleTransformStart : null
                        }
                        currentHeight={canvasParentHeight}
                        currentWidth={canvasParentWidth}
                      />
                    );
                  case "line":
                    return (
                      <LineShape
                        key={shape.id}
                        ref={(ref) => {
                          shapeRef.current[shape.id] = ref;
                        }}
                        {...shape}
                        scaleX={stageRef.current?.scaleX()}
                        scaleY={stageRef.current?.scaleY()}
                        onMouseEnter={handleMouseEnterInStage}
                        draggable={
                          !selectedShapeTool &&
                          !isFullScreen &&
                          !lockEdit &&
                          shape.id === selectedShapeId
                        }
                        onClick={
                          !lockEdit && !isFullScreen && !selectedShapeTool
                            ? (e) => handleSelectShape(shape.id, e)
                            : null
                        }
                        onDragEnd={
                          selectedShapeId
                            ? (e) => handleDragEnd(e, shape.id)
                            : null
                        }
                        onDragStart={selectedShapeId ? handleDragStart : null}
                        onDragMove={selectedShapeId ? handleDragMove : null}
                        dragBoundFunc={dragBoundFunc}
                        onTransformEnd={
                          selectedShapeId
                            ? (e) =>{ handleTransformEnd(e, shape.id)}
                            : null
                        }
                        onTransformStart={
                          selectedShapeId ? (e)=>{
                            e.stopPropagation();
                            
                            handleTransformStart()
                          } : null
                        }
                        currentHeight={canvasParentHeight}
                        currentWidth={canvasParentWidth}
                      />
                    );
                  default:
                    return null; // return null if shape type doesn't match
                }
              })}

            {newShape && (
              <>
                {(() => {
                  switch (newShape.properties.type) {
                    case "rectangle":
                      return (
                        <Rect
                          x={newShape.properties.x}
                          y={newShape.properties.y}
                          width={newShape.properties.width}
                          height={newShape.properties.height}
                          stroke="violet"
                          opacity={0.8}
                        />
                      );

                    case "circle":
                      return (
                        <Circle
                          x={newShape.properties.x}
                          y={newShape.properties.y}
                          radius={newShape.properties.radius}
                          stroke="violet"
                          opacity={0.8}
                        />
                      );

                    case "line":
                      return (
                        <Line
                          x={newShape.properties.x}
                          y={newShape.properties.y}
                          points={newShape.properties.points}
                          stroke="violet"
                          opacity={0.8}
                        />
                      );

                    default:
                      return null;
                  }
                })()}
              </>
            )}

            <Transformer
              ref={transformerRef}
              keepRatio={false}
              rotateEnabled={false}
              anchorSize={7}
              anchorCornerRadius={10}
            />
          </Layer>
        </Stage>
      </div>

      <Player url={url} ref={videoRef} parentref={canvasParentRef} hidden />
      <TransparentVideoController
        playerRef={videoRef}
        dimensions={dimensions}
        canvasParentRef={canvasParentRef}
      />
    </>
  );
});

export default Canvas;
