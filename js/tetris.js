//Dom
const playground=document.querySelector(".playground>ul");

//Setting
const Game_rows=20;
const Game_cols=10;

//playground 칸 나눠주기(실제로 넣어준다는 표현이 맞음)
for(let i=0; i<20; i++){
    const li=document.createElement("li");
    const ul=document.createElement("ul");
    for(let j=0; j<10; j++){
        const matrix=document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}
