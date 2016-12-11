var express=require('express');
var connection=require('socket.io');
var app=express();
var user=[];//用于存储用户名列表

// app.use("/",express.static(__dirname+"www"));

// app.use(express.static('public'));
app.use(express.static('assets'));
app.get('/',function(req,res){
	res.sendFile(__dirname+"/"+"index.html");
})

var server =app.listen(8081,function(){
	var host=server.address().address
	var port=server.address().port
	// console.log("应用实例，访问地址为http://%s:%s",host,port);
})
var io=connection.listen(server);
io.on('connection',function(socket){
	// socket.on('foo',function(data){
	// 	console.log(data);
	// });
	//新用户进入
	socket.on('enterRoom',function(username){
		if(user.indexOf(username)>-1){
			socket.emit("userExisted");
		}else if(username=="me"){
			socket.emit("unvalidusername");
		}else{
			socket.userIndex=user.length;
			socket.username=username;
			user.push(username);
			socket.emit("enter");
			io.sockets.emit('system',username,user,'enter');
		}
	});
	socket.on('sendMsg',function(content){
		socket.broadcast.emit("newMsg",socket.username,content);
		
	});

	//用户离开
	socket.on('disconnect',function(){
		if(socket.username){
			user.splice(socket.userIndex,1);
			socket.broadcast.emit("system",socket.username,user,'left');
		}
	})
})