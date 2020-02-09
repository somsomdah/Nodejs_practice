//express 기본묘듈
var http=require('http')
var express=require('express')
var path=require('path')

// express 미들웨어
var bodyParser=require('body-parser');
var cookieParser=require('cookie-parser');
var static=require('serve-static')
//var errorHandler=require('errorhandler')

//기타 모듈
var expressErrorHandler=require('express-error-handler')
var expressSession=require('express-session')
var multer=require('multer')
var fs=require('fs')
var cors=require('cors')


var app=express()
app.set('port',process.env.PORT||3000);
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/public',static(path.join(__dirname,'public'))) // 요청패스, static(파일경로)
app.use('/uploads',static(path.join(__dirname,'uploads')))
app.use(cookieParser())
app.use(expressSession({secret:'my key',resave:true,saveUninitialized:true}))
app.use(cors())

var storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'uploads')
    },
    filename:function(req,file,callback){
        var extension = path.extname(file.originalname); // 파일명
        var basename = path.basename(file.originalname, extension); //확장자
        callback(null, basename + Date.now() + extension);
    }
})

var upload=multer({
    storage:storage,
    limits:{
        files:10,
        fileSize:1024*1024*1024
    }
})

var router=express.Router()

router.route('/process/save').post(upload.single('photo'),function(req,res){
    
    try{
        var file=req.file;
        console.log("====파일정보====")
        console.dir(file)
    
        req.session.user={
            name:req.body.author,
            date:req.body.createDate,
            text:req.body.contents,
            image:req.body.photo
        }

        console.log("====작성내용====")
        console.log(req.session.user)
        

        filename=file.filename;
    
        res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
        res.write('<div><p>메모가 저장되었습니다.</p></div>');
        res.write('<img src="/uploads/' + filename + '" width="200px">');
        res.write('<div><input type="button" value="다시 작성" onclick="javascript:history.back()"></div>');
        res.end();
        console.log('메모 저장됨');

    }
    catch(err){
        console.dir(error.stack);
        res.writeHead(400, {'Content-Type':'text/html;charset=utf8'});
		res.write('<div><p>메모 저장 시 에러 발생</p></div>');
		res.end();
    }



})

app.use('/', router);


app.use(expressErrorHandler.httpError(404));
app.use(expressErrorHandler({static:{'404':'./public/404.html'}}))

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('웹 서버 시작됨 -> %s, %s', server.address().address, server.address().port);
  });
