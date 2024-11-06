import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { Stage, Layer, Rect, Transformer, Circle } from "react-konva";
import generateId from "../utils/generateId";

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
  const [shapes, setShapes] = useState([]); // State for storing shapes
  const [isDrawing, setIsDrawing] = useState(false); // State to track if drawing is active
  const [newShape, setNewShape] = useState(null); // State for the current shape being drawn
  const [selectedShapeId, setSelectedShapeId] = useState(null); // State for the selected shape ID
  const [currentTime, setCurrentTime] = useState(getCurrentTime); // Current time of the video
  const shapeRef = useRef({}); // Reference for each shape
  const transformerRef = useRef(); // Reference for the transformer
  const stageRef = useRef(null); // Stage reference for the Konva stage

  /**
   * Handle mouse down event to start drawing a new shape.
   *
   * @param {Object} e - The mouse event object.
   */
  const handleMouseDown = useCallback(
    (e) => {
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
    [currentTime]
  );

  /**
   * Handle mouse move event to update the shape dimensions while drawing.
   *
   * @param {Object} e - The mouse event object.
   */
  const handleMouseMove = useCallback(
    (e) => {
      if (!isDrawing || !newShape) return;
      const stage = e.target.getStage();
      const { x, y } = stage.getPointerPosition();
      const width = x - newShape.properties.x;
      const height = y - newShape.properties.y;
      setNewShape({
        ...newShape,
        properties: { ...newShape.properties, width, height },
      });
    },
    [isDrawing, newShape]
  );

  /**
   * Handle mouse up event to finalize drawing and add the shape to the state.
   *
   * @param {Object} e - The mouse event object.
   */
  const handleMouseUp = useCallback(() => {
    if (newShape) setShapes((prevShapes) => [...prevShapes, newShape]);
    setIsDrawing(false);
    setNewShape(null);
  }, [newShape]);

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
    if (e.target === e.target.getStage()) {
      setSelectedShapeId(null);
    }
  };

  /**
   * Handle shape deletion by filtering out the shape with the given ID.
   *
   * @param {string} shapeId - The ID of the shape to delete.
   */
  const handleDeleteShape = useCallback((shapeId) => {
    setShapes((prevShapes) =>
      prevShapes.filter((shape) => shape.id !== shapeId)
    );
    setSelectedShapeId(null);
  }, []);

  /**
   * Handle drag start event to change the cursor style.
   *
   * @param {Object} e - The event object.
   */
  const handleDragStart = (e) =>
    (e.target.getStage().container().style.cursor = "move");

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
  const handleTransformEnd = useCallback(
    (e, shapeId) => {
      const node = e.target;
      const { x, y, width, height } = node.attrs;
      if (!isFullScreen) {
        setShapes((prevShapes) =>
          prevShapes.map((shape) =>
            shape.id === shapeId
              ? {
                  ...shape,
                  properties: {
                    ...shape.properties,
                    x: x / scale.scaleX,
                    y: y / scale.scaleY,
                    width: width / scale.scaleX,
                    height: height / scale.scaleY,
                  },
                }
              : shape
          )
        );
      }
    },
    [scale, isFullScreen]
  );

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

  return (
    <Stage
      ref={stageRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ position: "absolute", top: 0, left: 0 }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={(e) => handleStageClick(e)}
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
                draggable={!isFullScreen}
                onClick={(e) => handleSelectShape(shape.id, e)}
                onDragEnd={(e) => handleDragEnd(e, shape.id)}
                onDragStart={handleDragStart}
                onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
              />
            ) : (
              <CircleShape
                key={shape.id}
                {...shape}
                scaleX={scale.scaleX}
                scaleY={scale.scaleY}
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
        />
      </Layer>
    </Stage>
  );
}

export default Canvas;
