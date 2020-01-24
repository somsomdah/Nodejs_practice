var fs=require('fs')

fs.open("./output.txt",'w',function(err,fd){ // 쓰기모드로 열기

    if (err) throw err;//throw errer
    var buf=new Buffer.from("hello node");//buffer에 데이터 저장

    // fd객체, 쓸 내용, offset(뭔지모름),문자열 크기, 위치, 콜백함수
    fs.write(fd,buf,0,buf.length,null,function(err,written,buffer){// fd객체로 파일 구별
        if(err) throw err;
        console.log(err,written,buffer); //error, 문자열길이, 버퍼에 저장된 문자열(?)
        fs.close(fd,function(){
            console.log("파일 열고,데이터 쓰고,파일 닫기 완료")
        });
    });
});

fs.open('./output.txt','r',function(err,fd){
    if(err) throw err
    var buf=new Buffer.alloc(10);
    console.log("버퍼 타입 : "+Buffer.isBuffer(buf))//버퍼인지 아닌지 확인

    fs.read(fd,buf,0,buf.length,null,function(err,bytesRead,buffer){
        if (err) throw err
        var inStr =buffer.toString('utf8',0,bytesRead); //바이너리 데이터를 담은 버처를 문자열로
        console.log("파일에서 읽은 데이터 : "+inStr)
        console.log(err,bytesRead,buffer);

        fs.close(fd,function(){
            console.log("output.txt 열고 읽기 완료");
        });

    });
});