// express 기본 모듈
var express=require('express');
var http=require('http');
var path=require('path');

//express 미들웨어
var bodyParser=require('body-parser') // 요청의 본문body부분을 해석해부는 미들웨어
var static=require('serve-static')

var app=express();

// 기본 속성 설정
app.set('port',process.env.port||3000);

//bodyparser는 클리아언트가 post방식으로 요청할 때 본문(body) 영역에 들어 있는 요청 파라미터를 파싱하여 body 속성에 넣엊ㅁ
// 사용자 요청을 처리하는 미들웨어 안의 req.body에 요청 파라미터가 들어감
// application/x-www-form-urlencoded 형식으로 전달된 요청 파라미터 파싱
app.use(bodyParser.urlencoded({extended:false}));

//application/json 형식으로 전달된 요청 파라미터 파싱
app.use(bodyParser.json());

// static 미들웨어 : 특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 만들어 줌
// public 폴더의 모든 파일들을 웹 서버의 루트 패스로 접근할 수 있도록 만들어 줌
app.use('/public',static(path.join(__dirname,'public')));

app.use(function(req,res,next){
    console.log("첫번째 미들웨어에서 요청 처리");

    var paramId=req.body.id||req.query.id; // 요청 파라미터 참조, get과 post를 모두 고려하기 위해
    var paramPassword=req.body.password||req.query.password; // 요청 피라미터 참조

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에 응답한 결과입니다</h1>');
    res.write('<div><p> param id : '+paramId+'</p></div>');
    res.write('<div><p> param password : '+paramPassword+'</p></div>');
    res.end();


})

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
  