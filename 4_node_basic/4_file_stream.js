fs=require('fs')

var infile=fs.createReadStream('./output.txt',{flags:'r'});
var outfile=fs.createWriteStream('./output2.txt',{flags:'w'});

infile.on('data',function(data){ //이벤트 리스너 - data이벤트가 발생하면(파일에서 데이터를 읽어들이면)
    console.log("읽어들인 데이터",data); //출력
    outfile.write(data);//파일에 써라
});

infile.on('end',function(){//이벤트리스너-데이터 읽어들이는것이 끝나면
    console.log('파일 읽기 종료'); //출력
    outfile.end(function(){ //파일 쓰기 종료해라
        console.log("파일 쓰기 종료");
    });
});

/*
var inname='./output.txt'
var outname='/output2.txt'

fs.exists(outname,function(exists){ // 기존 파일이 존재하는지 확인하고 콜백함수 호출, 콜백함수에는 존재여부가 알려짐
    if(exists){ // 기존 파일이 존재한다면 --> 요거요거 왜 안되지????????
        fs.unlink(outname,function(err){ //해당 파일명을 가진 파일을 삭제
            if(err) throw err
            console.log("기존 파일 ["+outname+"] 삭제함")
        });
    }

    var infile=fs.createReadStream('./output.txt',{flags:'r'});
    var outfile=fs.createWriteStream('./output2.txt',{flags:'w'});
    infile.pipe(outfile); // 파일 복사
    console.log("파일 복사 : ["+inname+"]->["+outname+"]")


});
*/

var infile=fs.createReadStream('./output.txt',{flags:'r'});
var outfile=fs.createWriteStream('./output3.txt',{flags:'w'});
infile.pipe(outfile); // 파일 복사