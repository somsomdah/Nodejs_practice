var http=require('http');

var options={
    host:'www.google.com',
    port:'80',
    path:'/'
};

//get 방식으로 다른 사이트에 데이터 요청
var req=http.get(options,function(res){
    var resData="";

    res.on('data',function(chunk){
        resData+=chunk;
    });

    res.on('end',function(){
        console.log("google 데이터");
        console.log(resData);
    });

    req.on('error',function(error){
        console.log("오류 발생 : "+error.message)
    })
})