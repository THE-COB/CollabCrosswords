var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var fs = require("fs");

app.get("/", (req,res) => {
	res.sendFile(__dirname+"/uiTemplate.html");
});

var clients = [];
var allChanges = {};
var numLets = 0;
io.on("connection", (socket) => {
	console.log("a user connected");
	clients.push(socket.id)
	fs.readFile(__dirname+"/sample.xw", (err,data) => {
		var dataArr = data.toString("utf-8").split('\n');
		for(var i of dataArr){
			if(!(i.match(/!B/) || i==="")){
				numLets++;
			}
		}
		for(var i of dataArr){
			io.sockets.connected[clients[clients.length-1]].emit("newBox", i);
		}
		for(var i in allChanges){
			io.sockets.connected[clients[clients.length-1]].emit("changeLetter", [i,allChanges[i].toUpperCase()]);
		}
	});

	fs.readFile(__dirname+"/sample.clue", (err,data) => {
		var dataArr = data.toString("utf-8").split('\n');
		var isAcross = true;
		for(var i of dataArr){
			if(i === "!across"){
				isAcross = true;
			}
			else if(i === "!down"){
				isAcross = false;
			}
			else if(i !== ""){
				var parsedClue = /([0-9]+),,(.*)/.exec(i);
				var num = parseInt(parsedClue[1]);
				var txt = parsedClue[2];
				io.sockets.connected[clients[clients.length-1]].emit("clue", num+",,"+txt+",,"+isAcross);
			}
		}
	});

	socket.on("disconnect", () => {
		console.log("a user disconnected")
	})

	socket.on("letterChange", (msg) => {
		var parsedMsg = /([0-9]+.),(.)/.exec(msg);
		io.emit("changeLetter", [parsedMsg[1],parsedMsg[2].toUpperCase()]);
		allChanges[parsedMsg[1]] = parsedMsg[2];

		if(allChanges.length === numLets){
			var good = true;
			for(var i of allChanges){
				var iLet = /[0-9]*(.)/.exec(i)[1];
				if(iLet !== allChanges[i].toUpperCase()){
					good = false;
					break;
				}
			}
			if(good){
				io.emit("finished", "true");
			}

		}

	});
})

http.listen(3000, () => {
	console.log("listening on localhost:3000");
})