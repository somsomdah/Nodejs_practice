var express=require('express'),http=require('http'),path=require('path');
var bodyParser=require('body-parser'),cookieparser=require('cookie-parser'),static=require('serve-static')
var expressSession=require('express-session'),expressErrorHandler=require('express-error-handler')
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

        UserSchema=mongoose.Schema({
            //스키마를 구체적으로 정의하기 위해 자바스크립트 객체를 전달할 수도 있다.
            id:{type:String,required:true,unique:true},//자료형, 필수여부, 고유여부
            password:{type:String,required:true},
            name:{type:String,index:'hashed'},
            age:{type:Number,'default':-1},
            created_at:{type:Date,index:{unique:false},'default':Date.now},//고유여부, 유효기간
            updated_at:{type:Date,index:{unique:false},'default':Date.now}
        })


        // 스키마에 메소드 추가
        UserSchema.static('findById',function(id,callback){
            return this.find({id:id},callback)
        });

        UserSchema.static('findAll',function(callback){
            return this.find({},callback)
        })

        
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

    UserModel.findById(id,function(err,results){
        if(err){
            callback(err,null) //인자로 받아온 콜백함수에서 처리하기

        }

        console.log('아이디 [%s], 비밀번호 [%s] 사용자 검색 결과',id,password)
        console.dir(results)//result에 find 메소드로 찾은 결과 전달됨

        if(results.length>0){
            console.log("아이디와 일치하는 사용자 찾음",id,password)
            callback(null,results)
            
            if(results[0]._doc.password==password){
                console.log("비밀번호 일치함")
                callback(null,results)
            }
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


router.route('/process/listuser').post(function(req,res){
    console.log('/process/listuser 호출됨')

    if(database){

        UserModel.findAll(function(err,results){

            if(err){
                console.error("사용자 리스트 조회 중 오류 발생 "+err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트 조회 중 오류 발생</h2>')
                res.write('<p>'+err.stack+'</p>')
                res.end()
    
                return
            }

            if(results){
                console.dir(results)

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트 </h2>')
                //res.write('<div><ul>')
                
                for (var i;i<results.length;i++){
                    var curId=results[i]._doc.id;
                    var curName=results[i]._doc.name;
                    console.log(curId+':'+curName)
                    res.write('<p>#'+i+' : '+curId+','+curName+'</p>')
                    //res.write('    <li> #'+i+' : '+curId+','+curName+'</li>')
                }

                //res.write('</ul></div>')
                res.end()

                console.error("사용자 리스트 조회 성공 ");

    
                return
            }else{
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>사용자 리스트 조회 실패</h2>')
                res.end()
            }

        });
    }else{
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>')
        res.end()
    }
})


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
