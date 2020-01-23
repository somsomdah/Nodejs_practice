var Calc=require("./2_calculator")

var calc=new Calc();
calc.emit('stop');

console.log(Calc.title+" 에 stop 이벤트 전달")
console.log(calc.add(2,3))