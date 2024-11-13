import { Observer } from "./ObserverDesignPattern";

const ObserverSelectionInstance  = new Observer();

const undo = () => ObserverSelectionInstance.notifyUndo();
const redo = () => ObserverSelectionInstance.notifyRedo();
const deleteShape = () => ObserverSelectionInstance.notifyDeleteShape();

export {
    undo , redo , deleteShape
}

export default ObserverSelectionInstance;