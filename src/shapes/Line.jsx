import React,{ forwardRef } from "react";
import { Line } from "react-konva";

export const LineShape = forwardRef(
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