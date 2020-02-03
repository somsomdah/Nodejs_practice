
var express=require('express');
var http=require('http');
var path=require('path');
var router =express.Router()

//express 미들웨어
var bodyParser=require('body-parser') // 요청의 본문body부분을 해석해부는 미들웨어
var static=require('serve-static')

var app=express();

// 기본 속성 설정
app.set('port',process.env.port||3000);

//bodyparser는 클리아언트가 post방식으로 요청할 때, 본문(body) 영역에 들어 있는 요청 파라미터를 파싱하여 req.body 속성에 넣어줌
app.use(bodyParser.urlencoded({extended:false})); // application/x-www-form-urlencoded 형식으로 전달된 요청 파라미터 파싱
app.use(bodyParser.json()); //application/json 형식으로 전달된 요청 파라미터 파싱

// static 미들웨어 : 특정 폴더의 파일들을 특정 패스로 접근할 수 있도록 만들어 줌
// public 폴더의 모든 파일들을 웹 서버의 루트 패스로 접근할 수 있도록 만들어 줌
// 그래서 http://localhost:3000/public/login2.html 접근 가능
app.use('/public',static(path.join(__dirname,'public')));

// 라우팅 함수 등록
router.route('/process/login').post(function(req,res){ // 클릭하면 요 주소로 이동 - html에 명시됨
    console.log('/process/login 처리함');

    //다음과 같은 내용 표시

    var paramId=req.body.id||req.query.id
    var paramPassword=req.body.password||req.query.password
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에 응답한 결과입니다</h1>');
    res.write('<div><p> param id : '+paramId+'</p></div>');
    res.write('<div><p> param password : '+paramPassword+'</p></div>');
    res.write("<br><br><a href='/public/login2.html'>로그인 페이지로 돌아가기</a>") // 요 주소로 돌아감
    res.end();

});

//라우터 객체를 app 객체에 등록, 즉 요청이 오면 라우팅
app.use('/',router) //path, function, 즉 현재 주소에 라우터 등록

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });