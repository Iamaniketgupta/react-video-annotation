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
  Line,
} from "react-konva";
import { throttle } from "lodash";
import generateId from "../utils/generateId";
import Player from "../VideoPlayer/Player";
import TransparentVideoController from "../VideoPlayerController/TransparentVideoplayerController";
import useVideoController from "../VideoPlayerController/UseVideoPlayerControllerHook";
import { useCanvas } from "../contexts/CanvasProvider";
import { LineShape } from "../shapes/Line";
import { CircleShape } from "../shapes/Circle";
import { Rectangle } from "../shapes/Rectangle";

const Canvas = forwardRef((
  {
    children,
    url,
    selectedShapeTool,
    hideAnnotations,
    lockEdit,
    annotationColor,
    opacity,
    strokeWidth,
    selectedAnnotationData,
    videoControls,

  }, ref

) => {

  const {
    shapes, setShapes,
    isDrawing, setIsDrawing,
    newShape, setNewShape,
    selectedShapeId, setSelectedShapeId,
    rectPosititon, setRectPosition,
    videoRefVal, setVideoRefVal,
    dimensions, setDimensions,
    history, setHistory,
    redoStack, setRedoStack,
    undo, redo, deleteShape
  } = useCanvas();


  // REF STATES
  const shapeRef = useRef({});
  const transformerRef = useRef();
  const stageRef = useRef(null);
  const canvasParentRef = useRef(null);
  const layerRef = useRef(null);
  const videoRef = useRef(null);

  // HOOK VALUES
  const { currentTime, setCurrentTime, isFullScreen } = useVideoController(
    videoRefVal,
    canvasParentRef
  );

  const [canvasParentWidth, setcanvasParentWidth] = useState(
    canvasParentRef?.current?.offsetWidth
  );
  const [canvasParentHeight, setcanvasParentHeight] = useState(
    canvasParentRef?.current?.offsetHeight
  );

  useEffect(() => {
    if (videoRef) {
      setVideoRefVal(videoRef);
    }
    return () => {
      setVideoRefVal(null);
    };
  }, [videoRef]);


  //  =================== Exported Handlers ===================================
  useEffect(() => {
    if (typeof selectedAnnotationData === 'function') {
      if (selectedShapeId) {
        const selectedData = shapes.find((shape) => shape.id === selectedShapeId);
        selectedAnnotationData(selectedData);
      } else {
        selectedAnnotationData(null);
      }
    }
  }, [selectedShapeId, shapes, selectedAnnotationData]);
  

  useImperativeHandle(ref, () => ({
    undo,
    redo,
    deleteShape
  }));



  // ============================================================================



  /**
   * Handle mouse down event to start drawing a new shape.
   *
   * @param {Object} e - The mouse event object.
   */
  const handleMouseDown = useCallback(
    (e) => {
      if (isFullScreen) return;
      
    const cursor = window.getComputedStyle(document.body).cursor;
      
      if (cursor === "nwse-resize") return;
      // console.log(selectedShapeTool)
      if (selectedShapeTool !== "rectangle" && selectedShapeTool !== "circle" && selectedShapeTool !== "line") {
        console.warning("Kindly Select appropriate tool which can only include line rectangle and circle");
        return;
      }
      const stage = e.target.getStage();
      if (!stage) return;
      const { x, y } = stage.getPointerPosition();
     // console.log({ x, y });

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
            strokeWidth: strokeWidth || 2,
            opacity: opacity
          };
          break;

        case "circle":
          shapeProperties = {
            type: "circle",
            x,
            y,
            radius: 4,
            startTime,
            endTime: startTime + 0.5,
            scaleX: 1,
            scaleY: 1,
            screenHeight: canvasParentHeight,
            screenWidth: canvasParentWidth,
            strokeWidth: strokeWidth || 2,
            opacity: opacity
          };
          break;

        case "line":
          shapeProperties = {
            type: "line",
            x,
            y,
            points: [0, 0, 100, 0, 100, 100],
            startTime,
            endTime: startTime + 0.5,
            scaleX: 1,
            scaleY: 1,
            screenHeight: canvasParentHeight,
            screenWidth: canvasParentWidth,
            strokeWidth: strokeWidth || 2,
            opacity: opacity
          };
          break;

        default:
          return;
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
      strokeWidth,
      opacity,
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

    if (x === newShape.properties.x && y === newShape.properties.y) return;

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
        const points = [
          0,
          0,
          x - newShape.properties.x,
          y - newShape.properties.y,
        ];

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
   * Handle drag start event to change the cursor style.
   *
   * @param {Object} e - The event object.
   */
  const handleDragStart = (e) => {
    
    setHistory((prevHistory) => [...prevHistory, shapes]);
    setRedoStack([]);
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
                  points: node.points().map((point, index) =>
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
      transformerRef.current.getLayer()?.batchDraw();
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
          position: "relative",
          // backgroundColor: "red",
        }}
      >
        <Player url={url} videoControls={videoControls} ref={videoRef} dimensions={imagedim} parentref={canvasParentRef} />

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
                  default:
                    return null;
                }
              })}

            {newShape && (
              <>
                {(() => {
                  switch (newShape.properties.type) {
                    case "rectangle":
                      return (
                        <Rect
                          x={newShape.properties?.x}
                          y={newShape.properties?.y}
                          width={newShape.properties.width}
                          height={newShape.properties.height}
                          stroke="violet"
                          opacity={0.8}
                        />
                      );

                    case "circle":
                      return (
                        <Circle
                          x={newShape.properties?.x}
                          y={newShape.properties?.y}
                          radius={newShape.properties.radius}
                          stroke="violet"

                          opacity={0.8}
                        />
                      );

                    case "line":
                      return (
                        <Line
                          x={newShape.properties?.x}
                          y={newShape.properties?.y}
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
      <TransparentVideoController
        playerRef={videoRef}
        dimensions={dimensions}
        canvasParentRef={canvasParentRef}
      />
    </>
  );
});

export default Canvas;
