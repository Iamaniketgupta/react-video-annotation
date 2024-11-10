/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { Stage, Layer, Rect, Transformer, Circle } from "react-konva";
import { throttle } from 'lodash';
import generateId from "../utils/generateId";
import { useVideoContext } from "../app/VideoPlayerContext";

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
      onTransformStart
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
      onDragStart={onDragStart}
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
 * @param {React.Ref} videoRef - Reference to the video element.
 * @param {Object} scale - Scaling factors for the canvas (scaleX, scaleY).
 * @param {boolean} isFullScreen - Boolean to determine if in full-screen mode.
 * @returns {JSX.Element} - Rendered canvas with shapes.
 */
function Canvas({ getCurrentTime, videoRef, scale, isFullScreen }) {

  // GENERAL STATES
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newShape, setNewShape] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [currentTime, setCurrentTime] = useState(getCurrentTime);

  // CONTEXT VALUES
  const { annotationColor, lockEdit, hideAnnotations } = useVideoContext()

  // REF STATES
  const shapeRef = useRef({});
  const transformerRef = useRef();
  const stageRef = useRef(null);

  // STACK STATES
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);


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
  const handleDeleteShape = useCallback(() => {
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
    const { x, y } = e.target.position();
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === shapeId
          ? { ...shape, properties: { ...shape.properties, x, y } }
          : shape
      )
    );
    e.target.getStage().container().style.cursor = "default";
  }, []);

  /**
   * Handle transform end event to update the shape's properties.
   *
   * @param {Object} e - The event object.
   * @param {string} shapeId - The ID of the shape being transformed.
   */

  const handleTransformStart = useCallback(() => {
    setHistory((prevHistory) => [...prevHistory,shapes]);
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
  const handleUndo = useCallback(() => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setRedoStack((prevRedoStack) => [shapes, ...prevRedoStack]);
      setShapes(lastState);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  }, [history, shapes]);

  // console.log({ "history": history })
  // console.log({ "REdo": redoStack })
  // console.log({ "shapes": shapes })

  /**
   * Handle REDO.
   */
  const handleRedo = useCallback(() => {
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
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        handleRedo();
      }
      if (e.key === 'Delete') {
        handleDeleteShape()
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo, handleDeleteShape]);



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



  useEffect(() => {
    if (!videoRef?.current?.paused || lockEdit) {
      setSelectedShapeId(null)
    }
  }, [videoRef?.current?.paused, lockEdit, videoRef]);

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ position: "absolute", top: 0, left: 0, display: hideAnnotations ? "none" : "block" }}
      onMouseDown={!lockEdit && !isFullScreen ? handleMouseDown : null}
      onMouseMove={!lockEdit && !isFullScreen ? handleMouseMove : null}
      onMouseUp={!lockEdit && !isFullScreen ? handleMouseUp : null}
      onClick={!isFullScreen ? (e) => handleStageClick(e) : null}


    >
      <Layer>
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
                scaleX={scale.scaleX}
                scaleY={scale.scaleY}
                draggable={!isFullScreen && !lockEdit}
                onClick={(!lockEdit && !isFullScreen) ? (e) => handleSelectShape(shape.id, e) : null}
                onDragEnd={selectedShapeId ? (e) => handleDragEnd(e, shape.id) : null}
                onDragStart={selectedShapeId ? handleDragStart : null}
                onTransformEnd={selectedShapeId ? (e) => handleTransformEnd(e, shape.id) : null}
                color={annotationColor}
                onTransformStart={selectedShapeId ? handleTransformStart : null}
              />
            ) : (
              <CircleShape
                key={shape.id}
                {...shape}
                scaleX={scale.scaleX}
                scaleY={scale.scaleY}
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
  );
}

export default Canvas;
