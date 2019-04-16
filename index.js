let canvas = document.querySelector('.drawingField');
canvas.width = canvas.offsetWidth; 
canvas.height = canvas.offsetHeight;
let ctx = canvas.getContext('2d'); //получить элемент для управления канвой


let lineColor = "black"; //цвет контура
let fillColor = "black"; //цвет заливки
let isFigureCreate = false; //создана ли ранее фигура (предотвращение нескольких фигур)

const startState = {x:430,y:200,scale:1}; //начальное состояние
let currentFigureState = {x: 0, y: 0, scale:1, mirrorOXKoef:1, mirrorOYKoef:1,mirrorXYKoef:1 }; //текущее состояние (вершина от которой толкаемся )


makeAxis();
// makeFigure(430,200);




//-------------------------------------- ОБРАБОТЧИКИ -------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

//масштабируем фигуру
document.querySelector('#scaleFigureButton').addEventListener('click', scaleFigure);


//стираем содержимое канвы
document.querySelector('#clearFigureButton').addEventListener('click', clearCanvas);


//нажатие на кнопку создания фигуры
document.querySelector('#makeFigureButton').addEventListener('click', (e)=>{
    makeFigure(430,200);
 });


//обработка изменения цвета линии
document.querySelector('#lineColor').addEventListener('change', (e)=>{
   lineColor = e.target.value;
});

//обработка изменения цвета заливки
document.querySelector('#fillColor').addEventListener('change', (e)=>{
    fillColor = e.target.value;
 });

 //переместим вдоль OX
 document.querySelector('#oxMoveButton').addEventListener('click', () =>{
   
    let {x,y,scale} = currentFigureState;

   let oxDist  = +document.querySelector('#oxMoveDist').value;
   moveFigure({x,y,distantion: oxDist,trend: "OX",scale });
});

//переместим вдоль OY
 document.querySelector('#oyMoveButton').addEventListener('click', () =>{
     //расстояние
   
     let {x,y,scale} = currentFigureState;

     let oyDist  = +document.querySelector('#oyMoveDist').value;
     moveFigure({x,y,distantion: oyDist,trend: "OY",scale });
 });

//отражения
 document.querySelector('#mirrorOYButton').addEventListener('click', ()=>mirror('OY'));
 document.querySelector('#mirrorOXButton').addEventListener('click', ()=>mirror('OX'));
 document.querySelector('#mirrorXYButton').addEventListener('click', ()=>mirror('XY'));



 document.querySelector('#rotateButton').addEventListener('click', rotateFigure);

//-------------------------------------- ОБРАБОТЧИКИ : КОНЕЦ ----------------------------------------------------------- 
//----------------------------------------------------------------------------------------------------------------------
// ----------------------------ФУНКЦИИ ПРЕОБРАЗОВАНИЯ--------------------------------------------------------------------

//вращаем фигуру вокруг центра координат
function rotateFigure(){
    if(!isFigureCreate) return;

    clearCanvas();

let {x,y,scale:scaleKoef} = currentFigureState;

ctx.strokeStyle = lineColor;
ctx.fillStyle = fillColor;

ctx.beginPath();
//первая вершина(верхняя и по часовой стрелке затем)
ctx.moveTo(...calculateRotateCoords(x,y));
ctx.lineTo(...calculateRotateCoords(x+10*scaleKoef,y-20*scaleKoef));
ctx.lineTo(...calculateRotateCoords(x+20*scaleKoef,y));
//вторая вершина
ctx.lineTo(...calculateRotateCoords(x+40*scaleKoef,y));
ctx.lineTo(...calculateRotateCoords(x+25*scaleKoef,y+15*scaleKoef));
//третья вершина
ctx.lineTo(...calculateRotateCoords(x+30*scaleKoef,y+30*scaleKoef));
ctx.lineTo(...calculateRotateCoords(x+10*scaleKoef,y+20*scaleKoef));
//четвертая вершина
ctx.lineTo(...calculateRotateCoords(x-10*scaleKoef,y+30*scaleKoef));
ctx.lineTo(...calculateRotateCoords(x-5*scaleKoef, y+15*scaleKoef));
//пятая вершина
ctx.moveTo(...calculateRotateCoords(x,y));
ctx.lineTo(...calculateRotateCoords(x-20*scaleKoef,y));
ctx.lineTo(...calculateRotateCoords(x-5*scaleKoef,y+15*scaleKoef));

ctx.stroke();
ctx.fill();

currentFigureState.x = x;
currentFigureState.y = y;
isFigureCreate = true;


}

//вычислить значения после поворота
function calculateRotateCoords(x,y){
    //получим угол в градусах
let angle = +document.querySelector('#rotateValue').value; //значение в градусах
console.log(angle);
    //(400;300)


    let radian = Math.PI/180 * angle;
    let newX = 400 + (x-400)*  Math.cos(radian) - (y - 300) * Math.sin(radian);
    let newY = 300 + (y-300) * Math.cos(radian) + (x-400) * Math.sin(radian);

    

    return [newX, newY];

}


//отражения
function mirror(axis){
    clearCanvas();

    let newMirror1=1,newMirror2=1;
    let {x,y,scale:scaleKoef} = currentFigureState;
    
    //получим необходимые значения для трех видов отражений
    switch(axis){
       case "OY":

    let {mirrorOYKoef} = currentFigureState;
    newMirror1 = mirrorOYKoef==1 ? -1 : 1;
    currentFigureState.mirrorOYKoef = newMirror1;
       break;
       case "OX":
    let {mirrorOXKoef} = currentFigureState;
    newMirror2 = mirrorOXKoef==1 ? -1 : 1;
    currentFigureState.mirrorOXKoef = newMirror2;
       break;
       case "XY":
    let {mirrorXYKoef} = currentFigureState; 
       newMirror1=newMirror2=mirrorXYKoef==1 ? -1 : 1;
       currentFigureState.mirrorXYKoef = newMirror1;
       break;
    }
     
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = fillColor;

    ctx.beginPath();
    //первая вершина(верхняя и по часовой стрелке затем)
    ctx.moveTo(x,y);
    ctx.lineTo(x+10*scaleKoef*newMirror1,y-20*scaleKoef*newMirror2);
    ctx.lineTo(x+20*scaleKoef*newMirror1,y);
   //вторая вершина
    ctx.lineTo(x+40*scaleKoef*newMirror1,y);
    ctx.lineTo(x+25*scaleKoef*newMirror1,y+15*scaleKoef*newMirror2);
    //третья вершина
    ctx.lineTo(x+30*scaleKoef*newMirror1,y+30*scaleKoef*newMirror2);
    ctx.lineTo(x+10*scaleKoef*newMirror1,y+20*scaleKoef*newMirror2);
    //четвертая вершина
    ctx.lineTo(x-10*scaleKoef*newMirror1,y+30*scaleKoef*newMirror2);
    ctx.lineTo(x-5*scaleKoef*newMirror1, y+15*scaleKoef*newMirror2);
    //пятая вершина
    ctx.moveTo(x,y);
    ctx.lineTo(x-20*scaleKoef*newMirror1,y);
    ctx.lineTo(x-5*scaleKoef*newMirror1,y+15*scaleKoef*newMirror2);

   ctx.stroke();
   ctx.fill();

   currentFigureState.x = x;
   currentFigureState.y = y;
 

}




 //очистить канву и нарисовать оси
 function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    makeAxis();
    isFigureCreate = false;
 }


//передвигать фигуру
function moveFigure(info){
    //еще не была создана
    if(!isFigureCreate) return;

    let {distantion, trend, x, y,scale} = info;
      
      switch(trend){
        case "OX": 
        clearCanvas();
        makeFigure(x+distantion,y,scale); 

        break;
        case "OY":
        clearCanvas();
        makeFigure(x,y+(distantion*(-1)), scale); 
  
        break;
      }
  
  }

//масштабирование фигуры
  function scaleFigure() {
      isFigureCreate = false;
      let scaleKoef = +document.querySelector('#scaleValue').value||1; //на случай пустого поля поставим ИЛИ
      let {x,y} = currentFigureState;
      clearCanvas();
      makeFigure(x,y,scaleKoef);
      currentFigureState.scale = scaleKoef;

  }


//нарисуем фигуру (звезду) 
function makeFigure(x,y,scaleKoef=1){
     //scaleKoef - коэффициент масштабирования

    // уже создана
    if(isFigureCreate) return;
  
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = fillColor;

    ctx.beginPath();
    //первая вершина(верхняя и по часовой стрелке затем)
    ctx.moveTo(x,y);
    ctx.lineTo(x+10*scaleKoef,y-20*scaleKoef);
    ctx.lineTo(x+20*scaleKoef,y);
   //вторая вершина
    ctx.lineTo(x+40*scaleKoef,y);
    ctx.lineTo(x+25*scaleKoef,y+15*scaleKoef);
    //третья вершина
    ctx.lineTo(x+30*scaleKoef,y+30*scaleKoef);
    ctx.lineTo(x+10*scaleKoef,y+20*scaleKoef);
    //четвертая вершина
    ctx.lineTo(x-10*scaleKoef,y+30*scaleKoef);
    ctx.lineTo(x-5*scaleKoef, y+15*scaleKoef);
    //пятая вершина
    ctx.moveTo(x,y);
    ctx.lineTo(x-20*scaleKoef,y);
    ctx.lineTo(x-5*scaleKoef,y+15*scaleKoef);

   ctx.stroke();
   ctx.fill();

   currentFigureState.x = x;
   currentFigureState.y = y;
   isFigureCreate = true;

}

// ------------------ФУНКЦИИ ПРЕОБРАЗОВАНИЯ : КОНЕЦ --------------------------------------------------------------------

//--------------------------------------ИНИЦИАЛИЗАЦИЯ-------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//сделаем оси координат
function makeAxis() {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(10, 300); // (x;y)
    ctx.lineTo(800,300);

    makeArrow(800,300, "right");

    ctx.moveTo(400,550);
    ctx.lineTo(400, 20);

    makeArrow(400,20,"top");
       
    ctx.stroke();
}



//сделать стрелочку на конце оси
function makeArrow(x,y,trend){

    switch(trend){
        case "right" : 
        ctx.moveTo(x-10,y-10);
        ctx.lineTo(x,y);
        ctx.moveTo(x-10, y+10);
        ctx.lineTo(x,y); 
        break;

        case "top":
        ctx.moveTo(x-10,y+10);
        ctx.lineTo(x,y);
        ctx.moveTo(x+10,y+10);
        ctx.lineTo(x,y);



    }
   
}

//-------------------------------------------ИНИЦИАЛИЗАЦИЯ : КОНЕЦ------------------------------------------------------------