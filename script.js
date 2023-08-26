const testMode = false

function enableMarkingAbb(cell){
    cell.addEventListener('contextmenu', (event) => {
        event.preventDefault();

        const cell = event.target;


        if(cell.getAttribute("revealed") === "true"){
            return;
        }

        if(cell.innerText === "🚩"){
            cell.innerText = "";
            return;
        }

        cell.innerText = "🚩";
    });
}

function isRevealed(element){
    return element.getAttribute("revealed") === "true";
}

function setStylesBasedOnNumber(element){
    const colors = ["#F4CA16", "#B11226", "#318CE7", "#20B2AA", "#39C800", "#006262", "#9457EB", "#EB00DF"];
    
    if(element.name === "X"){
        element.innerText = "";
        return;
    }
    element.style.color = colors[element.name];
}


function menuVisibility(visibility){
    const menu = document.getElementById("settingsMenu");
    if(visibility === false){
        menu.style="display:none;"
        return;
    }
    menu.style="display:block;"
    
}

function displayValue(){
    const out = document.querySelector("#value");
    const inp = document.querySelector("#slider");

    out.textContent = inp.value;
    inp.addEventListener("input", (event) => {
        out.textContent = event.target.value;
    });
}
displayValue();



function gameOver(status = false){
    const overMessage = document.getElementById("status");
   
    if(status){
        overMessage.innerText = "Victory!";
        overMessage.style.color = "green";   
    }

    document.getElementById("board").style.zIndex = "-1";

    overMessage.style = "display:block;";


    //displaing mines positions
    const ceils = document.getElementsByClassName("cell");
    for(cell of ceils){
        if(cell.name === "X"){
            cell.innerText = "X";
        }
    }
    
}

function checkGameStatus(){
    const ceils = document.getElementsByClassName('cell');

    for(cell of ceils){
        if(cell.name !== "X" && !isRevealed(cell)){
            return;
        }
    }

    gameOver(true);
}


function checkAround(board, cellNum){
    const size = Math.sqrt(board.length);

    for(let y = -1; y < 2; y++){
        for(let x = -1; x < 2; x++){
            let current = cellNum + (size * y) + x;
            if(current < 0 || current >= board.length){
                continue;
            }
            if(board[current].name === "X"){
                board[cellNum].name = String(Number(board[cellNum].name) + 1);
            }
        }
    }
}

function buttonHandler(event){
    onButtonClick(event.target);
}

function revealButton(target){
    if(target.name !== "0"){
        target.innerText = target.name;
    }

    target.setAttribute("revealed", "true");

    target.style.backgroundColor = "darkgray";
    target.style.border = "0";
}

function onButtonClick(target){
    if(target == undefined){
        return;
    }

    if(target.name === "X"){
        gameOver(); 
        return;
    }
    
    const items = [...document.querySelectorAll('.cell')];
    const tIndex = items.indexOf(target);

    const size = Math.sqrt(items.length);


    if(target.name !== "0"){
        revealButton(target);
        return;
    }


    //toUp
    for (let i = Math.floor(tIndex / size); i < size; i++) {
        //toRight
        for (let j = tIndex % size; j < size; j++) {
            if (items[i * size + j].name === "X" || isRevealed(items[i * size + j])) {
                break;
            }

            revealButton(items[i * size + j]);

            if (items[i * size + j].name !== "0"){
                break;
            }
        }

        //toLeft
        for (let j = tIndex % size; j >= 0; j--) {
            if (items[i * size + j].name === "X" || isRevealed(items[i * size + j])) {
                break;
            }
            
            revealButton(items[i * size + j]);

            if (items[i * size + j].name !== "0"){
                break;
            }
        }

    }

    //toDown
    for (let i = Math.floor(tIndex / size); i >= 0; i--) {
        //toRight
        for (let j = tIndex % size; j < size; j++) {
            if (items[i * size + j].name === "X" || isRevealed(items[i * size + j])) {
                break;
            }

            revealButton(items[i * size + j]);

            if (items[i * size + j].name !== "0"){
                break;
            }
        }

        //toLeft
        for (let j = tIndex % size; j >= 0; j--) {
            if (items[i * size + j].name === "X" || isRevealed(items[i * size + j])) {
                break;
            }

            revealButton(items[i * size + j]);

            if (items[i * size + j].name !== "0"){
                break;
            }
        }
    }


    checkGameStatus();
}



function generateField(size){
    const field = document.querySelector("#board");
    const cellSize = 100 / size;

    field.style.gridTemplateColumns = `repeat(${size}, ${cellSize}%)`;
    field.style.gridTemplateRows = `repeat(${size}, ${cellSize}%)`;

    for(let j = 0; j < size; j++){
        for(let i = 0; i < size; i++){
            field.innerHTML += '<button class="cell" name="0" onclick="buttonHandler(event)"> </button>'
        }
    }


    //let's place some mines
    const ceils = document.getElementsByClassName("cell");


    let minesCount = 0;

    let minesPositions = [];
    minesPositions.length = ceils.length;
    minesPositions.fill(false);

    while(minesCount < size){
        let seed = Math.floor((Math.random() * size * size)) % (size * size);
        if(minesPositions[seed] === false){
            minesPositions[seed] = true;

            ceils[seed].name = "X";
            if (testMode) {
                ceils[seed].innerText = "X";
            }

            minesCount++;
        }
    }



    //let's change name property by the mines around count
    for(let k = 0; k < ceils.length; k++){
        if(ceils[k].name !== "X"){
            checkAround(ceils, k);
        }
        
    }


    //activating some fe.
    for(element of ceils){
        setStylesBasedOnNumber(element);
        enableMarkingAbb(element);
    };
}

function start(){
    const fieldSize = document.querySelector("#slider").value;


    menuVisibility(false);

    generateField(fieldSize);
    
}
