import { createContext, useCallback, useContext, useState } from "react";

const CanvasContext = createContext();

export const CanvasProvider = ({ children, initialData }) => {
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

    // STACK STATES
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);


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

    return (
        <CanvasContext.Provider value={{
            shapes, setShapes,
            isDrawing, setIsDrawing,
            newShape, setNewShape,
            selectedShapeId, setSelectedShapeId,
            rectPosititon, setRectPosition,
            videoRefVal, setVideoRefVal,
            dimensions, setDimensions,
            history, setHistory,
            redoStack, setRedoStack,
            deleteShape, undo, redo
        }}>
            {children}
        </CanvasContext.Provider>
    )
}

export const useCanvas = () => {
    return useContext(CanvasContext);
}