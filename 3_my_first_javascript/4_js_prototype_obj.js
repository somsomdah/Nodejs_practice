// 프로토타입 객체 정의 >> 자바에서 클래스와 같은 개념
function Person(name,age){ // 생성자
    this.name=name
    this.age=age
}

// 객체 클래스 에 정의되는 함수라고 볼 수 있음
Person.prototype.walk=function(speed){ //Person.walk=function(...) 와 동일
    console.log(this.name+"이(가) "+speed+" 속도로 걸어갑니다.");
};

var p01=new Person("장다솜",23) // 객체 생성
var p02=new Person("장준하",18) // 객체 생성

console.log(p01.name)
p01.walk(10)