import { forwardRef } from "react";
import { Circle } from "react-konva";

export const CircleShape = forwardRef(
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
        strokeWidth={properties?.strokeWidth || 2}
        opacity={properties?.opacity || 1}
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