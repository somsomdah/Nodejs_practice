var fs=require('fs')

//// 동기식 IO ////
var data=fs.readFileSync('./test.txt','utf8')
console.log(data)


//// 비동기식 IO ////
fs.readFile("./test.txt","utf8",function(err,data){
    console.log(data)
})
console.log("test.txt 읽기 요청")

fs.writeFile("./output.txt","hello node",function(err){
    if(err){
        console.log("error : "+err)
    }
    console.log("output.txt에 쓰기 완료")
})
