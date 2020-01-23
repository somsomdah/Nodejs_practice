/// 예제1 ///
console.log("=====예제1=====")
function add(a,b,callback){
    var result=a+b
    callback(result); //add 함수의 파라미터로 다른 함수 전달
}

add(10,10,function(result){ //익명 함수
    console.log("콜백 함수 호출됨")
    console.log(result)
});

/// 예제2 ///
console.log("=====예제2=====")
function add(a,b,callback){
    var result=a+b
    callback(result) // 콜백 먼저 호출

    var history=function(){
        return a+'+'+b+'='+result
    };

    return history //소괄호가 붙은 history()는 history의 리턴값을, 소괄호가 없으면 함수 그 자체를 리턴함
}

var add_history=add(10,10,function(result){ // add의 리턴값을 저장하는 변수. 리턴값이 함수이므로 add_history()는 리턴되는 함수의 리턴값이, add_history는 함수 자체가 리턴됨
    console.log("콜백 함수 호출됨") // 익명함수 형태의 콜백 함수 내용
    console.log("결과 : "+result)
})

console.log("실행 결과 : "+add_history) // add history의 콜백함수의 내용을 로그에 뿌리고 "실행 결과 : " 문자열과 add_history에 저장되는 내용 뿌림. 이 부분이 없어도 콜백 함수의 내용은 실행됨


/// 예제 3 ///
console.log("=====예제3=====")
function add(a,b,callback){
    var result=a+b
    callback(result) // 콜백 함수는 파라미터로 전달됨

    var count=0;
    var history=function(){
        count++
        return count+':'+a+'+'+b+'='+result
    };

    return history 
}

var add_history=add(10,10,function(result){ 
    console.log("콜백 함수 호출됨") 
    console.log("결과 : "+result)
})

// 함수 안에서 새로운 함수를 만들어 접근하는 경우에는 예외적으로 변수 접근을 허용한다. 이를 closure라고 부름 
console.log("실행 결과 : "+add_history())
console.log("실행 결과 : "+add_history())
console.log("실행 결과 : "+add_history())