export class Manager{
    undo = null;
    redo = null;
    deleteShape = null;

    constructor(undo , redo , deleteShape){
        this.undo = undo;
        this.redo = redo;
        this.deleteShape = deleteShape;
    }

    makeUndo(){
        this.undo();
    }

    makeRedo(){
        this.redo();
    }

    makeDeleteShape(){
        this.deleteShape();
    }
}

export class Observer{
    observers=[];
    addObserver(observer){
        this.observers.push(observer);
    }

    removeObserver(observer){
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyRedo(){
        this.observers.forEach(observer => observer.makeRedo());
    }

    notifyUndo(){
        this.observers.forEach(observer=> observer.makeUndo());
    }

    notifyDeleteShape(){
        this.observers.forEach(observer => observer.makeDeleteShape());
    }
}