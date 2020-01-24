var util =require('util');//require가 import 모듈이랑 비슷한 듯
var EventEmitter=require('events').EventEmitter// eventemmiter 객체 참조

// 프로토타입 객체
var Calc=function(){
    var self=this;//자기자신
    this.on('stop',function(){
        console.log("Calc에 stop 이벤트 전달됨");
    });
};

util.inherits(Calc,EventEmitter);//Eventemitter 상속하도록 만듦 : emit함수 쓸 수 있음
Calc.prototype.add=function(a,b){ //calc 객체 속성으로 add 함수 추가
    return a+b;
}
module.exports=Calc;//외부에서 Calc 객체를 참조할 수 있도록
module.exports.title='calculator';