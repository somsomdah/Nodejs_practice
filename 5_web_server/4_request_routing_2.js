
var express=require('express');
var http=require('http');
var path=require('path');
var router =express.Router()
var bodyParser=require('body-parser')
var static=require('serve-static')
var app=express();

// 기본 속성 설정
app.set('port',process.env.port||3000);
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json());
app.use('/public',static(path.join(__dirname,'public')));

// 라우팅 함수 등록 - name : url parameter
router.route('/process/login/:name').post(function(req,res){ // 요청시 이 주소로 이동 - html에 url 파라미터 등록됨
    console.log('/process/login/:name 처리함');

    //다음과 같은 내용 표시

    var paramName=req.params.name
    var paramId=req.body.id||req.query.id
    var paramPassword=req.body.password||req.query.password
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에 응답한 결과입니다</h1>');
    res.write('<div><p> param name : '+paramName+'</p></div>');
    res.write('<div><p> param id : '+paramId+'</p></div>');
    res.write('<div><p> param password : '+paramPassword+'</p></div>');
    res.write("<br><br><a href='/public/login3.html'>로그인 페이지로 돌아가기</a>") // 요 주소로 돌아감
    res.end();

});

//라우터 객체를 app 객체에 등록, 즉 요청이 오면 라우팅
app.use('/',router) //path, function, 즉 현재 주소에 라우터 등록

// 오류 페이지 보여주기
// 등록되지 않은 패스에 대한 응답
app.all('*',function(req,res){
    res.status(404).send('<h1>error-페이지를 찾을 수 없습니다</h1>');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });