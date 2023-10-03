async function getDictionary() {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
    "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
        },
    });
    let data = await res.json();
    let dictionary = data.dictionary
    return dictionary
}
let dictionaryList;
getDictionary().then(function(myDictionary) {
    dictionaryList = myDictionary;
    dictionary();
});

function dictionary(){
    let n = Number.parseInt(Math.random() * Object.keys(dictionaryList).length);
    let dictionary = dictionaryList[n];
    const { word } = dictionary;
    const { hint } = dictionary;
    gameState.word = word;
    gameState.hint = hint;
    return;
}
const gameState = {
    word: '',
    hint: '',
    grid: Array(4)
        .fill()
        .map(()=> Array(4).fill('')),
    currentRow: 0,
    currentColumn: 0,
}


function updateBoard(){ 
    for(let i = 0; i < gameState.grid.length; i++){
        for(let j = 0; j < gameState.grid[i].length; j++){
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = gameState.grid[i][j];
        }
    }
}

function createBox(container, row, col, letter = ''){
    const box =  document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function createGrid(container){
    const grid = document.createElement('div');
    grid.className = 'grid';
    for(let i= 0; i < 4; i++){
        for(let j= 0; j < 4; j++){
            createBox(grid, i, j);
        }
    }
    container.appendChild(grid);
}

function removeGrid(){
    const wordle = document.getElementById('wordle')
    wordle.style.display = 'none';
}

function clearBoard(){
    var wordle = document.getElementById('wordle');
    wordle.style.display = "grid";
    var img  = document.getElementById("img");
    img.src = '';
    for(let i= 0; i < 4; i++){
        for(let j= 0; j < 4; j++){
            gameState.grid[i][j] = '';
            const box = document.getElementById(`box${i}${j}`);
            box.classList.remove(`correct`);
            box.classList.remove(`wrong`);
            box.classList.remove(`empty`);
            box.style.border = "1px solid gray"
        }
    }
    updateBoard();
    gameState.currentColumn = 0;
    gameState.currentRow = 0;
    var banner = document.getElementById("banner");
    banner.innerHTML = "";
    banner.style.backgroundColor = "";
    return;
}
function currentBox(){
    const row = gameState.currentRow;
    const col = gameState.currentColumn;
    const box = document.getElementById(`box${row}${col}`);
    box.style.border = "2px solid gray"
    return;
}
function removeCurrent(){
    const row = gameState.currentRow;
    const col = gameState.currentColumn;
    const box = document.getElementById(`box${row}${col}`);
    box.style.border = "1px solid gray"
    return;
}
function previousBox(){
    const row = gameState.currentRow;
    const col = gameState.currentColumn;
    if(col == 0 && row-1 == -1){
        return;
    }
    else if(col == 0){
        const box = document.getElementById(`box${row-1}${3}`);
        box.style.border = "1px solid gray"
    }
    else{
        const box = document.getElementById(`box${row}${col-1}`);
        box.style.border = "1px solid gray"
    }

}

function keyboardEvents(){ 
    document.body.onkeyup = (e) => {
        const lose = gameState.currentRow === 4;
        if(isWordCorrect(getWord())){
            showLetters(getWord());
            return;
            }
        else if(lose){
            return;
            }
        if (e.key.toLowerCase() === 'enter'){
            if(gameState.currentColumn === 4){
                const word = getWord();
                showLetters(word)
                gameState.currentRow++;
                gameState.currentColumn = 0;
            }
            else{
                alert('Not enough characters')
            }
        }
        if (e.key.toLowerCase() === 'backspace'){
            removeCurrent();
            removeLetter();
        }
        if(alpha(e.key)){
            addLetter(e.key);
            previousBox();
        }
        updateBoard();
        currentBox();
    };
}
function isWordCorrect(word) {
    if(word === gameState.word.toLowerCase()){
        return true;
    }
    else{
        return false;
    }
}

function showLetters(guess){
    const row = gameState.currentRow;
    for(let i = 0; i < 4; i++){
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;
        if(letter === gameState.word[i].toLowerCase()){
            box.classList.add(`correct`);
        }
        else if(gameState.word.toLowerCase().includes(letter)){
            box.classList.add(`wrong`);
        }
        else{
            box.classList.add(`empty`);
        }
    }
    if(gameState.word.toLowerCase() === guess){
        var img = document.getElementById("img");
        var banner = document.getElementById("banner");
        removeGrid();
        img.src = "https://res.cloudinary.com/mkf/image/upload/v1675467141/ENSF-381/labs/congrats_fkscna.gif";
        banner.innerHTML = "You guessed the word " + gameState.word.toUpperCase().bold() + " correctly";
        banner.style.backgroundColor = "#538d4e";
    }
    else if(gameState.currentRow === 3){
        var banner = document.getElementById("banner");
        banner.innerHTML = "You missed the word " + gameState.word.toUpperCase().bold() + " and lost!";
        banner.style.backgroundColor = "red";
    }
}

function alpha(key){
    return key.length === 1 && key.match(/[a-z]/i);
}

function getWord(){
    return gameState.grid[gameState.currentRow].reduce((prev, curr) => prev + curr);
}

function addLetter(letter){
    if(gameState.currentColumn === 4){
        return;
    }
    gameState.grid[gameState.currentRow][gameState.currentColumn] = letter;
    gameState.currentColumn++;
}
function removeLetter(){
    if(gameState.currentColumn === 0){
        return;
    }
    gameState.grid[gameState.currentRow][gameState.currentColumn - 1] = '';
    gameState.currentColumn--;
}
function hintBanner(){
    document.getElementById("banner").innerHTML = "Hint: " + gameState.hint;
}

function startup(){
    const wordle = document.getElementById('wordle');
    createGrid(wordle);
    keyboardEvents();
    currentBox();
}

var banner = document.getElementById("banner");
banner.innerHTML = "";
const button = document.getElementById("click");
const dark = document.getElementById("dark");
const hint = document.getElementById("hint");
const howTo = document.getElementById("htp");

button.addEventListener("click", async () =>{
    button.disabled = true;
    button.innerHTML = "Loading..."
    setTimeout(() => {
        dictionary();
        clearBoard();
        currentBox();
        button.disabled = false;
        button.innerHTML = "Start Over";
      }, 130);
    });

dark.addEventListener("click", function(){
    var element = document.body;
    var footer = document.getElementById('footer');
    element.classList.toggle("dark-mode");
    footer.classList.toggle('opened');
    
});
hint.addEventListener("click", function(){
    var banner = document.getElementById("banner");
    if(banner.innerHTML === ""){
        hintstr = "Hint: "
        banner.innerHTML = hintstr.italics() + gameState.hint;
        banner.style.backgroundColor = "#F6E6C2";
    }
    else{
        banner.innerHTML = "";
        banner.style.backgroundColor = "";
    }
});
howTo.addEventListener("click", function(){
    var info = document.getElementById("info");
    var toggle = document.getElementById("toggle")
    info.classList.toggle('opened');
    toggle.classList.toggle('opened');

})


startup();