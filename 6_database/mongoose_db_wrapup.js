var mongoose=rquire('mongoose')

mongoose.Promise=global.Promise;//mongoose의 promise 객체는 global의 promise 객체를 사용하도록 함
mongoose.connect(databaseUrl);//데이터베이스 연결정보를 파라미터로 넘겨줌
database=mongoose.connection;//mongoose의 connection 객체로 전달되는 이벤트를 통해 데이터베이스에 연결되었는지 여부를 알 수 있다.

database.on('event',function(){})
database.close()


// 스키마 정의
var Schema=mongoose.Schema({
    id:{type:String,required:true,unique:true},//자료형, 필수여부, 고유여부
    password:{type:String,required:true},
})

// 스키마에 메소드 추가
Schema.method('func1',function(){})
Schema.static('func2',function(){})

// 모델 정의
Model=mongoose.model("users",Schema);


/// 메소드/////
// 새로운 사용자 등록 - 모델의 인스턴스 객체
var user=new Model({"id":id,"password":password,"name":name});
user.save(function(err,addedUser){});
// 사용자 찾기
Model.find({"id":id,'password':password},function(err,results){});
// 조회후 업데이트
user.update({name:'name'})
Model.where({id:'test'}).update({name:'name'},function(err,...){})
//삭제
Model.remove({"id":id,"password":password,"name":name},function(err,...){});


// 함수 사용
Model.func1()
Model.func2()


