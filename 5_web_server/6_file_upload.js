var express=require('express')
var http=require('http')
var path=require('path')

var bodyParser=require('body-parser')
var cookiepParser=require('cookie-parser')
var static=require('serve-static')
var errorHandler=require('errorhandler')

var expressErrorHandler=require('express-error-handler')
var expressSession=require('express-session')

var multer=require('multer')
var fs=require('fs')

var cors=require('cors') //클라이언트에서 ajax로 요청했을 때 다중서버접속 지원


var app=express();
app.set('port',process.env.PORT||3000);

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/public',static(path.join(__dirname,'public'))) // 폴더 오픈
app.use('/uploads',static(path.join(__dirname,'uploads')))
app.use(cookiepParser()) // cookie-parser 설정
app.use(expressSession({secret:'my key',resave:true,saveUninitialized:true})); //세션 설정
app.use(cors()); // 클라이언트에 다중서버접속 지원

var storage=multer.diskStorage({
    destination:function(req,file,callback){ //업로드할 파일이 저장될 폴더
        callback(null,'uploads')
    },
    filename:function(req,file,callback){ // 업로드할 파일의 이름
        callback(null,file.originalname+Date.now())
    }
});

var upload=multer({
    storage:storage,
    limits:{ // 파일 제한
        files:10,
        fileSize:1024*1024*1024
    }
})

var router=express.Router();

router.route('/process/photo').post(upload.array('photo',1),function(req,res){
    console.log('/process/photo 호출됨')

    try{
        var files=req.files;

        console.log("#=====업로드 된 첫번째 정보=====#")
        console.dir(req.files[0])
        console.log("#==============================#")


        var originalname='',filename='',mimetype='',size='0';

        if (Array.isArray(files)){ //배열에 들어가있는 경우 ->현재 설정과 일치

            console.log("배열에 들어있는 파일 갯수 : "+files.length)

            for(var i=0;i<files.length;i++){
                originalname=files[i].originalname
                filename=files[i].filename;
                mimetype=files[i].mimetype;
                size=files[i].size;
            }
        }

        else{ //배열에 ㄷㅡㄹ어가있지 않은 경우 -> 현재 설정에는 해당 없음
            console.log("파일 갯수 : 1")
            originalname=files[i].originalname
            filename=files[i].filename;
            mimetype=files[i].mimetype;
            size=files[i].size;
        }

        console.log('현재 파일 정보 : ' + originalname + ', ' + filename + ', '+ mimetype + ', ' + size);

        // 클라이언트에 응답 전송
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h3>파일 업로드 성공</h3>');
        res.write('<hr/>');
        res.write('<p>원본 파일명 : ' + originalname + ' -> 저장 파일명 : ' + filename + '</p>');
        res.write('<p>MIME TYPE : ' + mimetype + '</p>');
        res.write('<p>파일 크기 : ' + size + '</p>');
        res.end();


    }
    catch(err){
        console.dir(err.stack)
    }
})

app.use('/', router);


// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
      '404': './public/404.html'
    }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



