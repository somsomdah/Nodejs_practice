// 변수
// 변수는 var에 저장됨. 키워드는 같아도 타입은 다를 수 있음
var age=23;
var name="장다솜";
//console.log("나이 : %d, 이름 : %s",age,name);


// 객체
var Person={};
Person["age"]=20; //이렇게 써도 되고
Person.name="장다솜"; // 이렇게 써도 됨
Person.mobile="01020156530"; 
//console.log("나이 : %d, 이름 : %s, 전화변호 : %s",Person.age,Person.name,Person["mobile"]);

// 함수
/// ver1
function add(a,b){
    return (a+b);
}
//var result=add(10,10);
//console.log("%d",result)

///ver2.1 - anonymus function
var add=function(a,b){
    return a+b;
};
///var result=add(10,5);
//console.log("%d",result);

/// ver2.2 - 객체 안의 속성으로 사용 가능
Person.add=function(a,b){
    return (a+b);
};
//console.log("%d",Person.add(5,5))

///ver2.3 변수로 할당 한 후 사용 가능
var oper=function(a,b){
    return (a+b);
};
Person.add=oper;
console.log("%d",Person.add(5,6))

/// ver2.4
// 객체를 만들면서 속성을 초기화
var Person={ // 객체를 여러번 정의해도 작동하는듯
    age:23,
    name:'장다솜',
    add:function(a,b){
        return a+b;
    }
};
console.log("%d %s",Person.age,Person.name);
console.log("%d",Person.add(2,3))
