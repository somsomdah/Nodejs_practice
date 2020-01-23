//process.on('exit',function(){console.log("exit 이벤트 발생함")})// 이벤트, 이벤트리스너
// 이벤트 이름이 'exit' 인 이벤트가 발생할 때, 이벤트 리스너 작동
//setTimeout(function(){console.log("2초뒤에 시스템 종료 시도함");process.exit()},2000); // 
// 2초 뒤에 해당 함수 실행. 함수에서는 exit 이벤트 발생

process.on('tick',function(count){console.log('tick 이벤트 발생',count)})
//tick 이벤트 발생하면 해당 리스너 실행
setTimeout(function(){console.log("2초 후에 tick 이벤트 전달 시도");process.emit('tick','2')},2000)
// 2초 후에 emit 함수를 통해 tick 이벤트 발생시킴, 이벤트리스너로 2라는 파라미터 전달