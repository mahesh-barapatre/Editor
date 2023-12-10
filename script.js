let colorpicker = document.getElementById('colorPicker');
let font = document.getElementById('font');
let size = document.getElementById('size');

const draggable = document.getElementById('draggable');
const sheet = document.getElementById('sheet');
const addBtn = document.getElementById('add');

let editable = true;

draggable.addEventListener('click', () => {
    let textInput = document.createElement('input');
    if(editable){
    draggable.innerHTML = null;
    draggable.style.border = 'none';
    
    textInput.type = 'text';
    textInput.placeholder = "ADD Text";
    textInput.style.position = 'absolute';
    textInput.style.padding = '8px';
    textInput.style.borderRadius = '5px';
    textInput.style.border = '1solid 1px #ccc';
        draggable.appendChild(textInput);
    }
        editable = false;

    addBtn.addEventListener('click', () => {
        let addedText = textInput.value;
        draggable.removeChild(textInput);
        draggable.innerHTML = addedText;
    });
});

let undoStack = [];
let redoStack = [];

colorpicker.addEventListener('change', (e) => {
    const oldValue = draggable.style.color;
    const newValue = e.target.value;
    draggable.style.color = newValue;
    addToUndoStack({ property: 'color', oldValue, newValue });
});

font.addEventListener('change', (e) => {
    const oldValue = draggable.style.fontFamily;
    const newValue = e.target.value;
    draggable.style.fontFamily = newValue;
    addToUndoStack({ property: 'fontFamily', oldValue, newValue });
});

size.addEventListener('change', (e) => {
    const oldValue = draggable.style.fontSize;
    const newValue = e.target.value + 'px';
    draggable.style.fontSize = newValue;
    addToUndoStack({ property: 'fontSize', oldValue, newValue });
});

const addOption = () => {
    const fontList = document.getElementById('fontList');
    const fontFamily = [
        'Arial',
        'Helvetica',
        'Verdana',
        'Times New Roman',
        'Georgia',
        'Times',
        'Courier New',
        'Courier',
        'Comic Sans MS',
        'Impact',
        'Lucida Console',
        'Lucida Sans Typewriter',
        'Lucida Sans Unicode',
        'Tahoma',
        'Trebuchet MS',
        'Verdana'
    ];
    fontFamily.forEach((item) => {
        const option = document.createElement('option');
        option.value = item;
        fontList.appendChild(option);
    });
};
addOption();

//drag functionality

//   draggable.addEventListener('drag', (e) => {
//     const x = e.clientX ;
//     const y = e.clientY ;
//     draggable.style.left = `${x-360}px`;
//     draggable.style.top = `${y-90}px`;
// });

sheet.addEventListener('dragover', (e) => {
    e.preventDefault();
});

 sheet.addEventListener('drop', (e) => {
    e.preventDefault();
    const x = e.clientX ;
    const y = e.clientY ;
    draggable.style.left = `${x-360}px`;
    draggable.style.top = `${y-90}px`;
  });

// Undo and Redo Functions

const addToUndoStack = (change) => {
    undoStack.push(change);
    clearRedoStack();
};

const addToRedoStack = (change) => {
    redoStack.push(change);
};

const clearRedoStack = () => {
    redoStack = [];
};

const undo = () => {
    if (undoStack.length > 0) {
        const change = undoStack.pop();
        applyChange(change, redoStack);
    }
};

const redo = () => {
    if (redoStack.length > 0) {
        const change = redoStack.pop();
        applyChange(change, undoStack);
    }
};

const applyChange = (change, stack) => {
    const { property, oldValue, newValue } = change;
    draggable.style[property] = oldValue;
    stack.push({ property, oldValue: newValue, newValue: oldValue });
};

// Event listeners for Undo and Redo buttons

const undoButton = document.getElementById('undo');
undoButton.addEventListener('click', undo);

const redoButton = document.getElementById('redo');
redoButton.addEventListener('click', redo);
