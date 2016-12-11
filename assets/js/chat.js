window.onload=function(){
	var chat=new Chat();
	chat.init();
}
var Chat=function(){
	this.socket=null;
}

Chat.prototype = {
	init:function(){
		var that=this;
		this.socket=io.connect();
		this.socket.on('connect',function(){
			document.getElementById("info").textContent="请输入您的用户名";
			document.getElementById("username-form").style.display="block";
			document.getElementById("input-name").focus();
		});
		this.socket.on('unvalidusername',function(){
			document.getElementById("info").textContent="不合法的用户名，请更换";
		})
		this.socket.on('userExisted',function(){
			document.getElementById("info").textContent="用户名已经存在，请更换";
		})
		this.socket.on('enter',function(){
			document.getElementById("layer").style.display='none';
		})
		this.socket.on('system', function(username, user, type) {
            var msg = username + (type == 'enter' ? ' joined' : ' left');
            // that._displayNewMsg('system ', msg, 'red');
            var count=user.length;
            document.getElementById('userlist').innerHTML=null;
            for (var i = 0; i <count; i++) {
            	var newuser=document.createElement('li');
            	newuser.innerHTML=user[i];
            	document.getElementById('userlist').appendChild(newuser);
            };
            
            document.getElementById('usercount').textContent = count +  '人';
            that._showMsg("system",msg);
        });
        this.socket.on('newMsg',function(username,content){
        	that._showMsg(username,content);
        	console.log(123);
		})

		//进入房间前输入自己的用户名
		document.getElementById("submit-username").addEventListener('click',function(){
			var username=document.getElementById("input-name").value;
			//检查用户名是否为空
			if(username.trim().length!=0){
				that.socket.emit('enterRoom',username);
			}else{
				document.getElementById('input-name').focus()
			}
		})
		//输入用户名时enter键盘事件监测
		document.getElementById("input-name").addEventListener('keyup',function(e){
			if(e.keyCode==13){//如果输入的是enter键
				var username=document.getElementById("input-name").value;
				//检查用户名是否为空
				if(username.trim().length!=0){
					that.socket.emit('enterRoom',username);
				}else{
					document.getElementById('input-name').focus()
				}
			}
		})

		//用户输入聊天内容时
		document.getElementById("sendBtn").addEventListener('click',function(){
			var content=document.getElementById("chat-content").value;
			// console.log("send");
			// console.log(content);
			//检查用户名是否为空
			if(content.trim().length!=0){
				that.socket.emit('sendMsg',content);
				that._showMsg('me',content);
				document.getElementById("chat-content").value=null;


			}
		})
		//用户输入聊天内容时enter键盘事件监测
		document.getElementById("chat-content").addEventListener('keyup',function(e){
			if(e.keyCode==13){//如果输入的是enter键
				var content=document.getElementById("chat-content").value;
				//检查用户名是否为空
				if(content.trim().length!=0){
					that.socket.emit('sendMsg',content);
					that._showMsg('me',content);
					document.getElementById("chat-content").value=null;
				}
			}
		})


	},
	_showMsg:function(user,msg){
		var content=document.getElementById("dialog-list");
		var newmsg=document.createElement('li');
		var date = new Date().toTimeString().substr(0, 8);
		if(user=="system"){//如果是系统消息
            newmsg.innerHTML='<p class="system">'+msg+'('+date+')</p>';
            content.appendChild(newmsg);
		}else{
			var newp1=document.createElement('p');
			newp1.innerHTML=user+"("+date+")";
			var newp1j=$(newp1);
			
			var newp2=document.createElement('p');
			var newp2j=$(newp2);
			newp2j.addClass('content');
			newp2.innerHTML=msg;
			if(user=="me"){
				newp1j.addClass("me");
				newp2j.addClass("me");

			}
			newmsg.appendChild(newp1);
			newmsg.appendChild(newp2);
			content.appendChild(newmsg);

		}
		var dialog=document.getElementById("dialog");
		dialog.scrollTop=dialog.scrollHeight;
	}
};

