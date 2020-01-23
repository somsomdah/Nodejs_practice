console.log("1. 주소 문자열을 url 객체로 변환하기")
// url 모듈을 사용하기 위해 require 메소드 호출
var url=require('url');

// 주소 문자열을 url 객체로
var curUrl=url.parse('https://github.com/search?q=nodejs')

//url 객체를 주소 문자열로
var curStr=url.format(curUrl)

console.dir(curUrl)
console.log(curStr)


console.log("2. 요청 파라미터 확인하기")
// querystring을 사용하기 위해 require 메소드 호출
var querystring=require('querystring')
var param=querystring.parse(curUrl.query) // 요청파라미터의 문자열을 파싱하여 객체로 만드어 줌

console.log(param) // 쿼리 객체
console.log(param.q)
console.log(querystring.stringify(param)) // 요청파라미터의 객체를 문자열로 변환 