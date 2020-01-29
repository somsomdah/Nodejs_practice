var http=require('http');
var express =require('express');

var app=express();// express 객체 생성
app.set('port',process.env.PORT||3000); // set 함수로 속성 지정 - 'port'라는 속성을 다음과 같이 지정
                                        // 속성 이름으로 'env','views', 'view engine' 사용 불가, 미리 정해진 속성 이름임

// 서버 객체 생성, 서버 시작, 포트에서 대기
http.createServer(app).listen(app.get('port'),function(){ //get 함수로 'port'속성 불러와서 포트 번호 전달 
    console.log("익스프레스 서버 시작 :"+app.get('port'));
});

var example_num=3;

if(example_num==0){
    
    // 미들웨어 등록
    app.use(function(req,res,next){
        console.log("첫번째 미들웨어 요청 처리");
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
        res.write('<h1>express 서버에 응답한 결과</h1>');
        next();
    });

    app.use(function(req,res,next){
        console.log("두번째 미들웨어 요청 처리");
        req.user='mike';
        next();
    });

    app.use(function(req,res,next){
        console.log("세번째 미들웨어 요청 처리")
        res.end('<h1>express 서버에서'+req.user+'가 응답한 결과</h1>');
        next();

    });
    
}

if(example_num==1){
// 클라이언트에 응답 데이터 전달
app.use(function(req,res,next){
    console.log("첫번째 미들웨어 요청 처리")
    res.send({name:"장다솜",age:"20"}); // 클라이언트에게 응답 데이터(json) 전송

});

}

if (example_num==2){
    // 다른 페이지로 이동
    app.use(function(req,res,next){
        console.log("첫번쨰 미들웨어 요청 처리");
        res.redirect("google.co.kr");
    });
}




if (example_num==3){
    console.log("익스프레스에서 요청 객체에 추가한 헤더와 파라미터 찾기")
    console.log("첫번째 미들웨어에서 요청 처리");
    app.use(function(req,res,next){

        var userAgent=req.header('User-Agent'); //헤더 확인
        var paramName=req.query.name // query는 get 방식으로 전송한 요청 파라미터 확인
    
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
        res.write('<h1>express 서버에 응답한 결과</h1>');
        res.write('<div><p>UserAgent : '+userAgent+'</p></div>');
        res.write('<div><p>paramName : '+paramName+'</p></div>');
    });


}