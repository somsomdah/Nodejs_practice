var fs=require('fs')

/*
fs.mkdir('./docs',0666,function(err){
    //if (err) throw err
    console.log("새로운 디렉토리 생성")

})

fs.rmdir('./docs',function(err){
    //if (err) throw err
    console.log("docs 폴더 삭제")
})
*/

//mkdir->rmdir 순서대로 실행시키기 위해 callback 함수 사용하는듯
fs.mkdir('./docs',0666,function(err){
    if (err) throw err
    console.log("새로운 디렉토리 생성")
    fs.rmdir('./docs',function(err){
        if (err) throw err
        console.log("docs 폴더 삭제")
    })

})