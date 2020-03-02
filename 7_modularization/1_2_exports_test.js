var user=require('./1_1_exports_test');

function showUser(){
    return user.getUser().name+','+user.group.name
}

function showUser(){
    return user().name
}

console.dir(user)
console.log(showUser())
