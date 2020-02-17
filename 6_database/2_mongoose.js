var express=require('express'),http=require('http'),path=require('path');
var bodyParser=require('body-parser'),cookieparser=require('cookie-parser'),static=require('serve-static')
var expressSession=require('express-session'),expressErrorHandler=require('express-error-handler')
//var MongoClient=require('mongodb').MongoClient;
var mongoose=require('mongoose');

var app=express()

app.set('port',process.env.PORT||3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public',static(path.join(__dirname,'public')))
app.use(cookieparser());
app.use(expressSession({secret:'my key',resave:true,saveUninitialized:true}))


var database;//데이터베이스 객체를 위한 변수 선언
var UserSchema;//데이터베이스 스키마 객체를 위한 변수 선언
var UserModel;//데이터베이스 모델 객체를 위한 변수 선언

function connectDB(){

    var databaseUrl="mongodb://localhost:27017/local";

    console.log('데이터베이스 연결으 시도합니다')
    mongoose.Promise=global.Promise;//mongoose의 promise 객체는 global의 promise 객체를 사용하도록 함
    mongoose.connect(databaseUrl);//데이터베이스 연결정보를 파라미터로 넘겨줌
    database=mongoose.connection;//mongoose의 connection 객체로 전달되는 이벤트를 통해 데이터베이스에 연결되었는지 여부를 알 수 있다.


    // error 이벤트(데이터베이스 연결이 제대로 되지 않았을 때) 발생시 이벤트 처리
    database.on('error',console.error.bind(console,'mongoose connection error'));

    //open 이벤트 발생(데이터베이스 연결)시 이벤트 처리
    database.on('open',function(){
        console.log('데이터베이스에 연결되셨습니다 : '+databaseUrl)

        //users컬렉션을 위해 스키마 정의, mongoose.Schema 메소드를 호출하여 새로운 스키마 생성
        UserSchema=mongoose.Schema({ //이름 : 타입으로 정의
            id:String,
            name:String,
            password:String
        })
/*
        var UserSchema=new mongoose.Schema({
            //스키마를 구체적으로 정의하기 위해 자바스크립트 객체를 전달할 수도 있다.
            id:{type:String,required:true,unique:true},//자료형, 필수여부, 고유여부
            password:{type:String,required:true},
            name:String,
            age:Number;
            created_at:Date,
            updated_at:Date
        })
*/
        console.log("UserSchema 정의함");

        //모델이름, 스키마객체 전달. 모델이름은 데이터베이스의 컬렉션에 매칭
        UserModel=mongoose.model("users",UserSchema);
        console.log('UserModel 정의함')
    });

    //disconnected 이벤트 발생(데이터베이스 연결이 끊어졌을 때)시 이벤트 처리
    database.on('disconnected',function(){
        console.log('연결이 끊어졌습니다. 5초후 다시 연결')
        setInterval(connectDB,5000)
    })

}

//사용자를 인증하는 함수
var authUser=function(database,id,password,callback){
    console.log('authUser 호출됨');

    UserModel.find({"id":id,'password':password},function(err,results){
        if(err){
            callback(err,null) //인자로 받아온 콜백함수에서 처리하기

        }

        console.log('아이디 [%s], 비밀번호 [%s] 사용자 검색 결과',id,password)
        console.dir(results)//result에 find 메소드로 찾은 결과 전달됨

        if(results.length>0){
            console.log("일치하는 사용자 찾음",id,password)
            callback(null,results)
        }
        else{
            console.log('일치하는 사용자 찾지 못함')
            callback(null,null)
        }
    });
};

//사용자를 등록하는 함수

var addUser=function(database,id,password,name,callback){
    console.log("adduser 호출됨 : ",id,password);

    //usermodel의 인스턴스 생성

    //user모델의 인스턴스 생성
    var user=new UserModel({"id":id,"password":password,"name":name})
    user.save(function(err,addedUser){
        if(err){
            callback(err,null)
            return;
        }

        console.log("사용자 데이터를 추가함");
        callback(null,addedUser);
    });
};

var router=express.Router()

// 로그인 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/process/login').post(function(req, res) {
	console.log('/process/login 호출됨.');

	// 요청 파라미터 확인
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
	
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
	
    // 데이터베이스 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
	if (database) {
		authUser(database, paramId, paramPassword, function(err, docs) {
			if (err) {throw err;}
			
            // 조회된 레코드가 있으면 성공 응답 전송
			if (docs) {
				console.dir(docs);

                // 조회 결과에서 사용자 이름 확인
				var username = docs[0].name;
				
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 성공</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
			
			} else {  // 조회된 레코드가 없는 경우 실패 응답 전송
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인  실패</h1>');
				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
		res.end();
	}
	
});


// 사용자 추가 라우팅 함수 - 클라이언트에서 보내오는 데이터를 이용해 데이터베이스에 추가
router.route('/process/adduser').post(function(req, res) {
	console.log('/process/adduser 호출됨.');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
	
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);
    
    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
	if (database) {
		addUser(database, paramId, paramPassword, paramName, function(err, addedUser) {
			if (err) {throw err;}
			
            // 결과 객체 있으면 성공 응답 전송
			if (addedUser) {
				console.dir(addedUser);
 
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 성공</h2>');
				res.end();
			} else {  // 결과 객체가 없으면 실패 응답 전송
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가  실패</h2>');
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
});


// 라우터 객체 등록
app.use('/', router);


var errorHandler=expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
})

app.use(expressErrorHandler.httpError(404))
app.use(errorHandler)


// 프로세스 정료시에  데이터베이스 연결 해제
process.on('SIGTERM',function(){
    console.log("프로세스가 종료됩니다");
})

app.on('close',function(){
    console.log("express 서버 객체가 종료됩니다.");
    if (database){
        database.close();
    }
})

http.createServer(app).listen(app.get('port'),function(){
    console.log('서버가 시작되었습니다. 포트 : '+app.get('port'));
    connectDB()
});
