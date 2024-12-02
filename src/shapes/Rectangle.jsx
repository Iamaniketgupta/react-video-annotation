import React,{ forwardRef } from "react";
import { Rect } from "react-konva";

export const Rectangle = forwardRef(
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