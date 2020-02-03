
var express=require('express');
var http=require('http');
var path=require('path');
var router =express.Router()
var bodyParser=require('body-parser')
var static=require('serve-static')
var app=express();
var expressErrorHandler=require('express-error-handler')

// 기본 속성 설정
app.set('port',process.env.port||3000);
app.use('/public',static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json());

// 라우팅 함수 등록 - id : url parameter // get 메소드
router.route('/process/users/:id').get(function(req,res){ // 요청시 이 주소로 이동 - html에 url 파라미터 등록됨
    console.log('/process/users/:id 처리함');

    var paramId=req.params.id//url 파라미터

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에 응답한 결과입니다</h1>');
    res.write('<div><p> param id : '+paramId+'</p></div>');
    res.end();

});

//라우터 객체를 app 객체에 등록, 즉 요청이 오면 라우팅
app.use('/',router) //path, function, 즉 현재 주소에 라우터 등록


// 모든 router 처리 끝난 후 오류 페이지 처리
var errorHandler=expressErrorHandler({
    static:{
        '404':'./public/404.html' //오류 페이지로 요거 보여줌
    }
})
app.use(expressErrorHandler.httpError(404))
app.use(errorHandler)

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });