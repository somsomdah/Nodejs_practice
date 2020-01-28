var http=require('http');

// 웹 서버 객체 생성
var server=http.createServer(); 
var port=3000; //서버가 대기할 포트

// 웹 서버 시작 : port 포트에서 클라이언트의 요청 대기, 웹 서거가 시작되면 콜백 함수 호출
server.listen(port,function(){ 
    console.log("웹 서버가 시작되었습니다 : "+port);
});


// 웹 서버 종료
//server.close(function(){ console.log("웹 서버가 종료되었습니다.")})

// 이벤트 처리 - 클라이언트 연결
server.on('connection',function(socket){ // connection 이벤트 발생 시 콜백함수로 소켓 객체 넘겨줌
    var addr=socket.address();
    console.log("클라이언트 접속 : "+addr.address+","+addr.port);
});

// 이벤트 처리 - 클라이언트 요청
server.on('request',function(req,res){ //request,respond
    console.log("클라이언트 요청이 들어왔습니다");
    //console.dir(req);
    //console.dir(res);
    // res 객체를 사용하여 클라이언트로 응답 보내기
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"}); // 응답으로 보낼 헤더 만듦
	res.write("<!DOCTYPE html>"); // 응답 본문 (body) 데이터 만듦
	res.write("<html>");
	res.write("  <head>");
	res.write("    <title>응답 페이지</title>");
	res.write("  </head>");
	res.write("  <body>");
	res.write("    <h1>노드제이에스로부터의 응답 페이지</h1>");
	res.write("  </body>");
	res.write("</html>");
	res.end(); // 클라이언트로 응답 데이터 전송
});

// 서버 종료
server.on('close',function(){
    console.log("서버가 종료됩니다");
});