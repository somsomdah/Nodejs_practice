// http 모듈로 파일 읽고 응답 //

var fs=require('fs')
var http=require('http') //import http as http 이런 느낌?

var server=http.createServer(function(req,res){
    var instream=fs.createReadStream('./output.txt'); // output.txt에서 스트림 만들어 읽기
    instream.pipe(res) // res에 복사 - 파일을 읽어 응답스트립(res)에 pipe로 연결 - 클라에언트와 스트림 연결
});

server.listen(7001,'127.0.0.1')