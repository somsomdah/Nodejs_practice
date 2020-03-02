// 외부에서 접근할 수 있는 exports 전역변수
/*
// 함수 추가
exports.getUser=function(){
    return {id:'test',name:'dasom'}
}

// 객체 추가
exports.group={id:'group01', name:'친구'}
console.log(exports.getUser())
*/



// exports에 객체 저장
// 이건 작동 안함 - exports에 객체를 할당하면 모듈시스템에서 처리하는 전역변수가 아닌 단순변수로 인식함
/* 
exports={
    getUser:function(){
        return {id:'function',name:'elise'};
    },
    group:{
        id:'group',name:'friend'
    }
}
*/
//console.log(exports)

// 요렇게 해야함
var user={
    getUser:function(){
        return {id:'function',name:'elise'};
    },
    group:{
        id:'group',name:'friend'
    }
}

module.exports=user


module.exports=function(){
    return {id:'function',name:'elise'};
}
