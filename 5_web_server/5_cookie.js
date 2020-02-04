var express=require('express');
var http=require('http');
var path=require('path');

var bodyParser=require('body-parser')
var static=require('serve-static')
var cookieParser=require('cookie-parser')


var app=express();
var router =express.Router()


app.set('port',process.env.port||3000);

app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json()); 
app.use('/public',static(path.join(__dirname,'public')));
app.use(cookieParser()); //요청 객체에 cookie 속성 추가됨


// cookie는 클라이언트의 웹 브라우저에 저장되는 정보

router.route('/process/showCookie').get(function(req,res){
    console.log("/process/showCoockie 호출됨")
    res.send(req.cookies.user) // 클라이언트테 cookies 객체 중 user 쿠키를 응답 데이터로 보냄
})

router.route('/process/setUserCookie').get(function(req,res){
    console.log('process/setUserCoockie 호출됨')
    // 쿠키 설정
    res.cookie('user',{
        id : 'somsomdah',
        name : 'Dasom Jang',
        authorized:true

    });

    res.redirect('/process/showCookie'); //웹 페이지 경로 강제 이동시킴
});


//라우터 객체를 app 객체에 등록, 즉 요청이 오면 라우팅
app.use('/',router) //path, function, 즉 현재 주소에 라우터 등록

// 오류 페이지 보여주기 - 등록되지 않은 패스에 대한 응답
app.all('*',function(req,res){
    res.status(404).send('<h1>error-페이지를 찾을 수 없습니다</h1>');
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });