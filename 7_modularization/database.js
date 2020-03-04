var mongoose=require('mongoose')

var database={}

database.init=function(app,config){
    console.log('init() called')
    connect(app,config)
}


// 데이터베이스 연결
function connect(app,config){
    console.log('connect() called')

    mongoose.Promise=global.Promise;
    mongoose.connect(config.db_url) // 데이터베이스 연결정보를 파라미터로 넘겨줌
    database.db=mongoose.connection // mongoose의 connection 객체로 전달되는 이벤트를 통해 데이터베이스에 연결되었는지 여부를 알 수 있다.

    database.db.on('error',console.error.bind(console,'mongoose connection error')) // 연결 에러
    database.db.on('open',function(){console.log('connected to database.db'); createSchema(app,config);})// db 열렸을 때
    database.db.on('dinsconnected',connect) // 연결 안됐을 때
}

// 스키마 생성
function createSchema(app,config){

    var schemaLen=config.db_schemas.length;
    console.log('schema Length : '+schemaLen);

    for (var i=0;i<schemaLen;i++){
        var curItem=config.db_schemas[i];//스키마 불러옴

        var curSchema=require(curItem.file).createSchema(mongoose) // 모듈 파일에서 불러온 후 사용
        var curModel=mongoose.model(curItem.collection,curSchema) // 지정할 테이블 이름, 사용할 스키마 ->데이터베이스 등록
        database[curItem.schmaName]=curSchema;
        database[curItem.modelName]=curModel;
    }

    app.set('database',database);// database객체가 app객체의 속성으로 추가됨
}


module.exports=database


/*
database={
    db:<mongose.connection()>
    curItem:{schemaName: ~,moedelName:~}
}
*/