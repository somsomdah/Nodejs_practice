
//express 기본 모듈
var express=require('express');
var http=require('http');
var path=require('path');

//express 미들웨어
var bodyParser=require('body-parser')
var static=require('serve-static')
var cookieParser=require('cookie-parser')
var expressSession=require('express-session')
var errorHandler=require('errorhandler')
var expressErrorHandler=require('express-error-handler')



var app=express();

app.set('port',process.env.port||3000);
app.use(bodyParser.urlencoded({extended:false})); 
app.use(bodyParser.json()); 
app.use('/public',static(path.join(__dirname,'public')));
app.use(cookieParser()); //세션을 사용할 때에는 쿠키도 같이 사용함
app.use(expressSession({secret:"my key",resave:true,saveUninitialized : true}))//세션 객체를 호출하여 반환하는 객체



var router =express.Router()

//상품정보 라우팅 함수
router.route('/process/product').get(function(req,res){
    console.log('/process/product 호출됨');
    
    if (req.session.user){ //user세션 객체가 있다면
        res.redirect('/public/product.html')
    }
    else{
        res.redirect('/public/login2.html')
    }
})

//로그인 라우팅 함수 - 로그인 후 세션 저장
router.route('/process/login').post(function(req,res){ // 클라이언트에서 요청시 이 주소로 이동
    console.log('/process/login 처리함');

    //다음과 같은 내용 표시
    var paramId=req.body.id||req.query.id
    var paramPassword=req.body.password||req.query.password

    if (req.session.user){
        console.log("이미 로그인 되어 상품 페이지로 이동합니다")
        res.redirect('/public/product.html')
    }
    else{ // 세션 저장
        req.session.user={
            id:paramId,
            name : "장다솜",
            authorized:true
        }
    }

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>Express 서버에 응답한 결과입니다</h1>');
    res.write('<div><p> param id : '+paramId+'</p></div>');
    res.write('<div><p> param password : '+paramPassword+'</p></div>');
    res.write("<br><br><a href='/process/product'>상품 페이지로 이동하기</a>") // 요 주소로 돌아감
    res.end();

});

router.route('/process/logout').get(function(req,res){
    console.log('/process/logout 호출됨');

    if (req.session.user){
        console.log('로그아웃합니다')
        req.session.destroy(function(err){
            if (err) {throw err}
            console.log('세션을 삭제하고 로그아웃 되었습니다');
            res.redirect('/public/login2.html')
        })
    }

    else{
        console.log("아직 로그인하지 않았습니다")
        res.redirect('/public/login2.html')
    }
})


//라우터 객체를 app 객체에 등록, 즉 요청이 오면 라우팅
app.use('/',router) //path, function, 즉 현재 주소에 라우터 등록

// 오류 페이지 보여주기 - 등록되지 않은 패스에 대한 응답
app.use(expressErrorHandler.httpError(404))
app.use(errorHandler);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });