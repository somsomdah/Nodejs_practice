// 배열
var Users=[{name:"장다솜",age:23},{name:"전영희",age:52}]; // 배열은 대괄호 사용
Users.push({name:"장영근",age:57}); // 배열의 뒤에 push 해줌
var add=function(a,b){
    return a+b;
};
Users.push(add)

console.log(Users) //object type와 function type
console.log(Users[3](2,3))// 세번째 요소로 추가한 함수 실행
console.log(Users.length)//배열의 길이
Users.pop(add) //배열의 뒤쪽부터 삭제

// for문 사용하기
for (var i=0;i<Users.length;i++){
    console.log(Users[i])
}

// forEach 구문 사용하기
// forEach에는 배열의 요소와 인덱스 값을 받아옴
Users.forEach(function(item,index){
    console.log(index+" : "+item);
});


// 배열에 값 추가 및 삭제
/// 배열의 앞에 요소 추가
Users.unshift({name:"장준하",age:"18"});
console.log(Users)
/// 배열의 앞에 요소 삭제
Users.shift()
console.log(Users);

/// splice 메소드 : 여로개 추가, 삭제
Users.splice(1,2) // 인덱스 1부터 두개 삭제
console.log(Users)

Users.splice(0,0,{name:"전영희",age:52})// 인덱스0부터 0개 삭제후 새로운 객체 앞쪽에 추가
console.log(Users)

// slice 메소드로 잘라내기
var Users2=Users.slice(0,1) // 인덱스 0이상 1미만 잘라내어 복사함
console.log(Users)
console.log(Users2)
Users2.unshift({name:"장준하",age:18})
console.log(Users2.slice(0)) // 인덱스 0인 원소부터 잘라내어 복사