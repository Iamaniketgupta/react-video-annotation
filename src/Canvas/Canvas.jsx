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
 * CircleShape component renders a circle shape on the canvas.
 *
 * @param {number} x - X position of the circle.
 * @param {number} y - Y position of the circle.
 * @param {number} radius - Radius of the circle.
 * @param {string} color - Fill color of the circle.
 * @param {number} scaleX - Horizontal scale factor.
 * @param {number} scaleY - Vertical scale factor.
 * @returns {JSX.Element} - Rendered circle.
 */
const CircleShape = ({ x, y, radius, color, scaleX, scaleY }) => (
  <Circle
    x={x * scaleX}
    y={y * scaleY}
    radius={radius * Math.min(scaleX, scaleY)}
    fill={color}
    shadowBlur={5}
  />
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
      const stage = e.target.getStage();
      if (!stage) return;
      const { x, y } = stage.getPointerPosition();
      const startTime = currentTime;
      setNewShape({
        id: generateId(),
        color: annotationColor,
        label: "",
        data: {},
        properties: {
          type: "rectangle",
          x,
          y,
          width: 4,
          height: 4,
          startTime,
          endTime: startTime + 0.5,
          scaleX: 1,
          scaleY: 1,
          screenHeight: canvasParentHeight,
          screenWidth: canvasParentWidth,
        },
      });
      setIsDrawing(true);
    },
    [currentTime, isFullScreen, annotationColor]
  );

  /**
   * Handle mouse move event to update the shape dimensions while drawing.
   *
   * @param {Object} e - The mouse event object.
   */

  const handleMouseMove = (e) => {
    if (isFullScreen) return;
    if (!isDrawing || !newShape) return;

    const stage = e.target.getStage();
    if (!stage) return;
    const { x, y } = stage.getPointerPosition();

    if (x !== newShape.properties.x || y !== newShape.properties.y) {
      const width = Math.abs(x - newShape.properties.x);
      const height = Math.abs(y - newShape.properties.y);

      setNewShape((prevShape) => ({
        ...prevShape,
        properties: { ...prevShape.properties, width, height },
      }));
    }
  };

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
    // Ensure the click isn't on a shape
    console.log({ e: e.target });
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
    setHistory((prevHistory) => [...prevHistory, shapes]);
    setRedoStack([]);
  }, [shapes]);

  const handleTransformEnd = useCallback(
    (e, shapeId) => {
      const node = e.target;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(1);
      node.scaleY(1);

      if (!isFullScreen) {
        setShapes((prevShapes) =>
          prevShapes.map((shape) =>
            shape.id === shapeId
              ? {
                ...shape,
                properties: {
                  ...shape.properties,
                  x: node.x(),
                  y: node.y(),
                  width: node.width() * scaleX,
                  height: node.height() * scaleY,
                },
              }
              : shape
          )
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
      video.play();
      updateCanvas();
    }

    video?.addEventListener("play", () => {
      video.play();
    });

    video?.addEventListener("pause", () => {
      video.pause()
    });

    return () => {
      video.pause();
    };
  }, []);


  const [imagedim,setImgDim]=useState(dimensions) 

  useEffect(() => {
    const updateSize = () => {
      if (canvasParentRef.current) {
        const { offsetWidth, offsetHeight } = canvasParentRef.current;
        setDimensions({
          width: offsetWidth,
          height: offsetHeight,
        });
        setImgDim(
          {
            width: offsetWidth,
            height: offsetHeight,
          }
        )
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

            {selectedShapeId &&
              shapes.find((shape) => shape.id === selectedShapeId) && (
                <Text
                  text="❌"
                  x={
                    shapes.find((shape) => shape.id === selectedShapeId)
                      ?.properties?.x +
                    shapes.find((shape) => shape.id === selectedShapeId)
                      ?.properties?.width +
                    5
                  }
                  y={
                    shapes.find((shape) => shape.id === selectedShapeId)
                      ?.properties?.y - 15
                  }
                  fill="red"
                  strokeWidth={3}
                  shadowColor="white"
                  fontSize={10}
                  onClick={(e) => deleteShape(e)}
                />
              )}

            {shapes
              .filter(
                (shape) =>
                  currentTime >= shape.properties.startTime &&
                  currentTime <= shape.properties.endTime
              )
              .map((shape) =>
                shape.properties.type === "rectangle" ? (
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
                      selectedShapeId ? (e) => handleDragEnd(e, shape.id) : null
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
                ) : (
                  <CircleShape
                    key={shape.id}
                    {...shape}
                    scaleX={stageRef.current?.scaleX()}
                    scaleY={stageRef.current?.scaleY()}
                    color={annotationColor}
                  />
                )
              )}
            {newShape && (
              <Rect
                x={newShape.properties.x}
                y={newShape.properties.y}
                width={newShape.properties.width}
                height={newShape.properties.height}
                stroke="violet"
                opacity={0.8}
              />
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
