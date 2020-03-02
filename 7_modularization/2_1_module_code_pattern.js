function User(id, name){ // 생성자라고 봐야 함
    this.id=id;  // this는 User의 속성이 아니며,객체를 생성할 때 함수 안에서 쓰이는 변수에 불과함
    this.name=name;

    return 0;
}

// user의 protype라는 속성에 저장하는 것이기 때문에 객체들은 protype에 있는 속성과 함수를 공유한다
User.prototype.getUser=function(){
    return {id: this.id,name:this.name};
}


User.prototype.group={id:'group01',name:'friends'} // 공유되는 변수라고 보면 됨 java에서의 static과 같다고 보면 될듯

User.prototype.printUser=function(){
    console.log('user : %s, group :%s',this.name,this.group.name)
}

User.prototype.changeGroup=function(id,name){
    User.prototype.group={id:id,name:name}
}

User.prototype.changeId=function(id){
    this.id=id
}

User.test='test' // User의 속성이며 객체에서는 접근 불가능

//module.exports=new User('id','name');
module.exports=User


/*
var user1=User('user01','name01')//함수처럼 작용, return값, 안에 있는 속성은 사용할 수 없음
var user2=new User('user01','name02')// 클래스처럼 작용한는듯

//console.log(user1)
//console.log(user2)
//user2.printUser()

var user3=new User('user03','name03')
user3.changeGroup('group02','bestFriends')

user2.printUser()
console.log(user2.group)
user3.printUser()
console.log(user3.group) // 위와 동일, user3.group를 명시하지 않으면 User.prototype.group를 리턴하는 것

user2.changeId('id');
console.log(user2)

User.test='test'

// User 자체의 속성
console.log(User.prototype)
console.log(User.test)

// 함수 User에 정의된 변수
console.log(User)
console.log(User.id) //이런식으로는 함수 User에 정의된 변수 접근 불가
console.log(user2.id)

// 1. 함수를 클래스처럼 쓰려면 new를 이용하여 객체 생성해야 함
// 2. 함수(생성자) 안의 변수와 함수의 속성은 완전히 다름
*/