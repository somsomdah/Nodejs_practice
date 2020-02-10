var express=require('express'),http=require('http'),path=require('path');
var bodyParser=require('body-parser'),cookieparser=require('cookie-parser'),static=require('serve-static')
var expressSession=require('express-session'),expressErrorHandler=require('express-error-handler')
var MongoClient=require('mongodb').MongoClient;


var app=express()

app.set('port',process.env.PORT||3000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/public',static(path.join(__dirname,'public')))
app.use(cookieparser())
app.use(expressSession({secret:'my key',resave:true,saveUninitialized:true}))

var database;

// 데이터베이스 연결 함수
function connectDB(){
    console.log('connectDB 호출됨')
    var databaseUrl='mongodb://localhost:27017/local'
    MongoClient.connect(databaseUrl,function(err,db){ //데이터베이스가 정상적으로 연결되면 db객체에 전달됨
        if(err) throw err;
        console.log('데이터베이스에 연결되었습니다')
        //database=db; //mongodb 3.0 이상이서 작동하지 않음
        database = db.db('local');
    })
}

// 사용자 인증 함수
var authUser=function(database,id,password,callback){
    console.log('authUser 호출됨');

    //users collection 참조
    var users = database.collection('users');
    
    // 사용자 찾기 - 조회결과는 toArray를 통해 배열로 전배열로 바꿔줌
    users.find({"id":id,"password":password}).toArray(function(err,docs){ //콜백 함수에는 toArray의 문서 객체 docs 전달됨

        console.log('users.find().toArray() 호출됨')
        if(err){callback(err,null); return;}

        if(docs.length>0){ // 사용자 데이터 조회
            console.log('아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음',id,password);
            callback(null,docs);

        }else{ // 사용자 데이터 없음
            console.log('일치하는 사용자 찾지 못함');
            callback(null,null);
        }
    })
}

var addUser=function(database,id,password,name,callback){
    console.log('addUser 호출됨 : '+id+','+password+','+name);

    //users collection 참조
    var users = database.collection('users');

    // 데이터 추가
    users.insertMany([{"id":id,"password":password,"name":name}],function(err,result){

        //오류가 발생했을 때 콜백함수를 호출하면서 오류 객체 전달
        if(err){ 
            callback(err,null);
            return;
        }

        // 오류가 아닌 경우 콜백 함수를 호출하면서 결과 객체 전달
        else if(result.insertedCount>0){ //추가된 레코드의 갯수 확인
            console.log("사용자 레코드 추가됨 : "+result.insertedCount);
        } else {
            console.log("추가된 레코드 없음");
        } callback(null,result);
    })
}


router=express.Router()

router.route('/process/login').post(function(req,res){
    console.log('/process/login 호출');

    var paramId=req.param('id')
    var paramPassword=req.param('password');
    
    // 데이터베이스여 연결됨
    if(database){

        authUser(database,paramId,paramPassword,function(err,docs){
            console.log("authUser callback 호출됨") // 콜백함수는 기존 함수의 내용이 전부 실행된 다음에 실행됨
            if(err) {throw err;}
            if(docs){
                console.dir(docs);
                var username=docs[0].name;
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 성공</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();

            }

            else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인  실패</h1>');
				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
            }
        })
    }

    else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
		res.end();
	}
})

router.route('/process/adduser').post(function(req,res){
    console.log('/process/adduser 호출됨');

    var paramId=req.param('id')
    var paramPassword=req.param('password');
    var paramName=req.param('name');

    console.log('요청 파라미터 : '+paramId+','+paramPassword+','+paramName);

    if(database){
        addUser(database,paramId,paramPassword,paramName,function(err,result){
            if(err) throw err;

            if (result && (result.insertedCount>0) ){
                console.dir(result);
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 성공</h2>');
                res.write("<br><br><a href='/public/login.html'>로그인하기</a>");
				res.end();
            }
            else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 실패</h2>');
				res.end();
            }
        })
    }

    else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
		res.end();
	}
})

app.use('/',router)

app.use(expressErrorHandler(404));
app.use(expressErrorHandler({static:{'404':'./public/404.html'}}))

http.createServer(app).listen(app.get('port'),function(){
    console.log('서버가 시작되었습니다.')
    connectDB();
})