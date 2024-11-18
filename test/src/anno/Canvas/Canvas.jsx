/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { Stage, Layer, Rect, Transformer, Circle, Image } from "react-konva";
import { throttle } from 'lodash';
import generateId from "../utils/generateId";
import { useVideoContext } from "../app/VideoPlayerContext";
// import { redo, undo ,deleteShape} from "./utils";
import { Manager } from "../observerDesignPattern/ObserverDesignPattern";
import ObserverSelectionInstance from "../observerDesignPattern/ObserverSelectionInstance";
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
      dragBoundFunc
    },
    ref
  ) => (
    <Rect
      ref={ref}
      x={properties.x * scaleX}
      y={properties.y * scaleY}
      width={properties.width * scaleX}
      height={properties.height * scaleY}
      shadowBlur={5}
      stroke={color}
      strokeWidth={2}
      draggable={draggable}
      onClick={onClick}
      onDragEnd={onDragEnd}
      onMouseEnter={(e) => e.target.getStage().container().style.cursor = "pointer"}
      onMouseLeave={(e) => e.target.getStage().container().style.cursor = "default"}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
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
function Canvas({ url }) {

  // GENERAL STATES
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [rectPosititon, setRectPosition] = useState({ x: null, y: null });
  const [videoRefVal, setVideoRefVal] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: 500,
    height: 300,
  });

  // HOOK VALUES
  const {
    currentTime,
    setCurrentTime,
    isFullScreen
  } = useVideoController(videoRefVal);

  // CONTEXT VALUES
  const { annotationColor, lockEdit, hideAnnotations } = useVideoContext()

  // REF STATES
  const shapeRef = useRef({});
  const transformerRef = useRef();
  const stageRef = useRef(null);
  const canvasParentRef = useRef(null);
  const layerRef = useRef(null);
  const videoRef = useRef(null);

  // STACK STATES
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    setVideoRefVal(videoRef)

    return () => {
      setVideoRefVal(null)
    }
  }, [videoRef])
  /**
   * Handle mouse down event to start drawing a new shape.
   *
   * @param {Object} e - The mouse event object.
   */
  const handleMouseDown = useCallback(
    (e) => {
      if (isFullScreen) return;
      const stage = e.target.getStage();
      const { x, y } = stage.getPointerPosition();
      const startTime = currentTime;
      setNewShape({
        id: generateId(),
        color: "red",
        label: "",
        data: {},
        properties: {
          type: "rectangle",
          x,
          y,
          width: 0,
          height: 0,
          startTime,
          endTime: startTime + 0.5,
          scaleX: 1,
          scaleY: 1
        },
      });
      setIsDrawing(true);
    },
    [currentTime, isFullScreen]
  );

  /**
   * Handle mouse move event to update the shape dimensions while drawing.
   *
   * @param {Object} e - The mouse event object.
   */

  const handleMouseMove =
    throttle((e) => {
      if (isFullScreen) return;
      if (!isDrawing || !newShape) return;

      const stage = e.target.getStage();
      console.log(stage)
      const { x, y } = stage.getPointerPosition();

      if (x !== newShape.properties.x || y !== newShape.properties.y) {
        const width = x - newShape.properties.x;
        const height = y - newShape.properties.y;

        setNewShape((prevShape) => ({
          ...prevShape,
          properties: { ...prevShape.properties, width, height },
        }));


      }
    }, 100)

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

    if (e.target === e.target.getStage()) {
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
  }

  /**
   * Handle drag end event to update the shape's position.
   *
   * @param {Object} e - The event object.
   * @param {string} shapeId - The ID of the shape being dragged.
   */
  const handleDragEnd = useCallback((e, shapeId) => {
    const { x, y } = rectPosititon;
    console.log({ x, y })
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
  }, [rectPosititon]);

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
   * UNDO/REDO shortcut key events
   */

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
      if (e.key === 'Delete') {
        deleteShape()
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
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
  }, [ videoRef]);


  const isVisible = useCallback((shapeId) => {
    const shape = shapes.find((shape) => shape.id === shapeId);
    return (
      currentTime >= shape?.properties?.startTime &&
      currentTime <= shape?.properties?.endTime
    );
  } ,[currentTime, shapes]);

  useEffect(() => {
    if (!videoRef.current?.paused || lockEdit || !isVisible(selectedShapeId)) {
      setSelectedShapeId(null)
    }
  }, [videoRef.current?.paused, lockEdit, currentTime, isVisible, selectedShapeId]);



  useEffect(() => {
    const observer = new Manager(undo, redo, deleteShape);
    ObserverSelectionInstance?.addObserver(observer);

    return () => {
      ObserverSelectionInstance?.removeObserver(observer);
    };
  }, [history, redo, undo, deleteShape]);

  // lo
  const dragBoundFunc = (pos) => {

    const newX = Math.max(0, Math.min(pos.x, dimensions.width - shapeRef.current[selectedShapeId].width()));
    const newY = Math.max(0, Math.min(pos.y, dimensions.height - shapeRef.current[selectedShapeId].height()));
    console.log({ newX, newY })

    return { x: newX, y: newY };
  };
  const handleDragMove = (e) => {

    const newX = Math.max(0, Math.min(e.target.x(), dimensions.width- shapeRef.current[selectedShapeId].width()));
    const newY = Math.max(0, Math.min(e.target.y(),dimensions.height - shapeRef.current[selectedShapeId].height()));
    console.log({ newX, newY })

    setRectPosition({ x: newX, y: newY });

  };

  const drawVideoFrame = useCallback(() => {
    const layer = layerRef.current;
    const videoElement = videoRef.current;

    if (videoElement && layer) {
      const context = layer.getCanvas().getContext('2d');
      context.clearRect(0, 0, layer.getCanvas().width, layer.getCanvas().height);
      context.drawImage(videoElement, 0, 0, canvasParentRef.current?.offsetWidth, canvasParentRef.current?.offsetHeight);
      layer.batchDraw();
    }
  },[]);


  useEffect(() => {
    const videoElement = videoRef.current;
    let animationFrameId;

    const updateFrame = () => {
      drawVideoFrame();
      animationFrameId = requestAnimationFrame(updateFrame);
    };

    videoElement?.addEventListener('play', () => {
      animationFrameId = requestAnimationFrame(updateFrame);
    });

    videoElement?.addEventListener('pause', () => {
      cancelAnimationFrame(animationFrameId);
    });

    videoElement?.addEventListener('ended', () => {
      cancelAnimationFrame(animationFrameId);
    });

    return () => {
      videoElement?.removeEventListener('play', updateFrame);
      videoElement?.removeEventListener('pause', updateFrame);
      videoElement?.removeEventListener('ended', updateFrame);
      cancelAnimationFrame(animationFrameId);
    };
  }, [drawVideoFrame, videoRef]);


  useEffect(() => {
    const updateSize = () => {
      if (canvasParentRef.current) {
        const { offsetWidth, offsetHeight } = canvasParentRef.current;
        setDimensions({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);



  return (
    <>
      <div
        ref={canvasParentRef}
        style={
          {
            maxWidth: window.innerWidth,
            aspectRatio: "16/9",
            minHeight: 300,
            minWidth: 500,
            border: "1px solid blue"
          }
        }>
        <Stage

          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}

          style={{ backgroundColor: "black", display: hideAnnotations ? "none" : "block" }}
          onMouseDown={!lockEdit && !isFullScreen ? handleMouseDown : null}
          onMouseMove={!lockEdit && !isFullScreen ? handleMouseMove : null}
          onMouseUp={!lockEdit && !isFullScreen ? handleMouseUp : null}
          onClick={!isFullScreen ? (e) => handleStageClick(e) : null}


        >
          <Layer
            ref={layerRef}
          >
            <Image
              image={videoRef?.current}
              width={dimensions.width}
              height={dimensions.height}

            />

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
                    draggable={!isFullScreen && !lockEdit && shape.id === selectedShapeId}
                    onClick={(!lockEdit && !isFullScreen) ? (e) => handleSelectShape(shape.id, e) : null}
                    onDragEnd={selectedShapeId ? (e) => handleDragEnd(e, shape.id) : null}
                    onDragStart={selectedShapeId ? handleDragStart : null}
                    onDragMove={selectedShapeId ? handleDragMove : null}
                    dragBoundFunc={dragBoundFunc}
                    onTransformEnd={selectedShapeId ? (e) => handleTransformEnd(e, shape.id) : null}
                    color={annotationColor}
                    onTransformStart={selectedShapeId ? handleTransformStart : null}
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
                opacity={0.5}
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

      <Player url={url}
        ref={videoRef} parentref={canvasParentRef} hidden />
      <TransparentVideoController playerRef={videoRef} dimensions={dimensions} />
    </>

  );
}

export default Canvas;