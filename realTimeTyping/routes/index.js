module.exports = function Route(app){
	users = [];
  app.get('/', function(req, res){
    res.render('index', {title:'Real Time Typing'});
  });
  //listen for new user
  app.io.route('got_a_new_user',function(req){
  	//add to user array
  	users.push({name:req.data.new_name,id:req.sessionID});
  	//for everyone else
  	req.io.broadcast('new_user',{name:req.data.new_name,id:req.sessionID});
  	//for the person being added
  	req.io.emit('existing_users',{arr:users});
  });
  //disconnected user
  app.io.route('disconnect',function(req){
  	console.log('\nDisconnect man\n',req.sessionID);
  	//take the person out of the array that is leaving
  	for (var i = 0; i < users.length; i++) {
  		if (users[i].id == req.sessionID) {
  			console.log("I'm in here");
  			temp = users[i];
  			users[i] = users[users.length - 1];
  			users[users.length - 1] = temp;
  			users.pop();
  		}
  	}
  	console.log(users);
  	//tell everyone who was removed
  	req.io.broadcast('disconnected_user',{id:req.sessionID});
  });
  //updated text
  app.io.route('message_update',function(req){
  	var msg = {id:req.sessionID,message:req.data.message};
  	req.io.broadcast('new_message',msg);
  });

 //you will add more routes and logic here but this is how to write the default route for your project
}