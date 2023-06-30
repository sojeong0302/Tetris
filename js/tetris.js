import BLOCKS from "./blocks.js"

//Dom
const playground = document.querySelector(".playground>ul");
const gameText = document.querySelector(".game-text")
const scoreDisplay = document.querySelector(".score")
const restartButton = document.querySelector(".game-text > button")

//Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

//변수 선언
let score = 0;//점수
let duration = 500;//블록이 떨어지는 시간
let downInterval;
let tempMovingItem;//잠깐 담아두는 용도

const movingItem = {
    type: "",
    direction: 3,//화살표를 눌렀을때 방향을 돌려주는 역할
    //화살표를 통해 top와 left의 값을 증가 시켜야함
    top: 0,
    left: 0,
};

init();

//처음 시작
function init() {

    tempMovingItem = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    }
    generateNewBlock();
}

function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}

function renderBlocks(moveType="") {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, "moving")
        } else {
            tempMovingItem = { ...movingItem }
            if(moveType==='retry'){
                clearInterval(downInterval)
                showGameoverText()
            }
            setTimeout(() => {
                renderBlocks('retry');
                if(moveType==="top"){
                    seizeBlock();
                }
            }, 0)
            return true;
        }
    })
    movingItem.left=left;
    movingItem.top=top;
    movingItem.direction=direction;
}

//맨 밑에서 더 이상 갈 곳이 없을때 처리할 코드
function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving")
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}
function checkMatch(){
    const childNodes=playground.childNodes;
    childNodes.forEach(child=>{
        let matched=true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched=false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerText=score;
        }
    })
    generateNewBlock()
}
//새로운 아이템 생기게 해줌
function generateNewBlock(){
    clearInterval(downInterval);
    downInterval=setInterval(()=>{
        moveBlock('top',1)
    },duration)
    const blockArray=Object.entries(BLOCKS);
    const randomIndex=Math.floor(Math.random()*blockArray.length)
    movingItem.type=blockArray[randomIndex][0]
    movingItem.top=0;
    movingItem.left=3;
    movingItem.direction=0;
    tempMovingItem={ ...movingItem };
    renderBlocks()
}

function checkEmpty(target) {
    if (!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}
function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}
function chageDirection(){
    const direction=tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction=0:tempMovingItem.direction+=1;
    renderBlocks()
}

//스페이스바 눌렀을 때 처리
function dropBlock(){
    clearInterval(downInterval)
    downInterval=setInterval(()=>{
        moveBlock("top",1)
    },10)
}

function showGameoverText(){
    gameText.style.display="flex"
}
//방향키로 top랑 left 증가시키기
document.addEventListener("keydown", e => {
    switch (e.keyCode) {
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left", -1);
            break;
        case 40:
            moveBlock("top", 1);
            break;
        case 38:
            chageDirection();
            break;
        case 32:
            //스페이스바
            dropBlock();
            break;
        default:
            break;
    }
})

restartButton.addEventListener("click",()=>{
    playground.innerHTML="";
    gameText.style.display="none"
    init()
})