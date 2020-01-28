var http=require('http')

var options={
    host:'www.google.com',
    port:'80',
    mrthod:'POST',
    path:'/',
    headers:{}
};

//var resData="";

// POST 방식으로 요청 - 구글 사이트에서는  POST 요청을 받지 못하므로 오류 표시
var req=http.request(options,function(res){
    var resData="";
    res.on('data',function(chunk){
        resData+=chunk;
    });

    res.on('end',function(){
        console.log(resData);
    });

})

options.headers['Content-Type']='application/x-www-form-urlencoded';
req.data="q-actor";
options.headers['Content-Length']=req.data.length

req.on('error',function(error){
    console.log("오류 발생 : "+error.message)
})

req.write(req.data);
req.end();