class Box{
	constructor(coord, blacked, num, ans){
		this.coordinate = coord;
		this.isBlacked = blacked;
		if(blacked){
			this.number = null;
			this.letter = null;
			return;
		}
		this.number = num;
		this.letter = ans;
		this.clues = [0,0]
	}

	setAcross(a){
		this.clues[0] = a;
	}
	setDown(d){
		this.clues[1] = d;
	}

	str(){
		var strForm = "";
		strForm+=this.coordinate[0]+','+this.coordinate[1];
		if(this.isBlacked){
			strForm+="!B";
			return strForm;
		}
		strForm+=this.letter;
		if(this.number !== null){
			strForm+='n'+this.number;
		}
		strForm+='c'+this.clues[0]+','+this.clues[1]
		return strForm;
	}
}

var puzzle = []

var gs = document.querySelector("#xwd-board > g:nth-child(5)").children

var ogLevel = parseInt(gs[0].children[0].getAttribute("y"));
var change = parseInt(gs[1].children[0].getAttribute("x"))-parseInt(gs[0].children[0].getAttribute("x"))

for(g of gs){
	var rect = g.children[0];
	var xCoord = (parseInt(rect.getAttribute("x"))-ogLevel)/change
	var yCoord = (parseInt(rect.getAttribute("y"))-ogLevel)/change

	rClasses = rect.classList;
	if(rClasses[0] == "Cell-block--1oNaD"){
		puzzle.push(new Box([xCoord,yCoord],true,null,null))
	}
	else{
		var num = null;
		var ans = "";
		if(g.children[1].getAttribute("text-anchor") == "start"){
			num = parseInt(g.children[1].textContent);
			ans = g.children[2].textContent.charAt(0);
		}
		else{
			ans = g.children[1].textContent.charAt(0);
		}
		puzzle.push(new Box([xCoord,yCoord],false,num,ans))
	}
}

var endNum = puzzle[puzzle.length-1].coordinate[0];
endNum++;

function getAClue(box, num){
	if(box.coordinate[0] === 0 || puzzle[num-1].isBlacked){
		return box.number;
	}
	else{
		return getAClue(puzzle[num-1],num-1);
	}
}

function getDClue(box, num){
	if(box.coordinate[1] === 0 || puzzle[num-endNum].isBlacked){
		return box.number;
	}
	else{
		return getDClue(puzzle[num-endNum],num-endNum);
	}
}

for(var i = 0; i<puzzle.length; i++){
	if(!puzzle[i].isBlacked){
		puzzle[i].setAcross(getAClue(puzzle[i],i));
		puzzle[i].setDown(getDClue(puzzle[i],i));
	}
}

var f = "";
for(box of puzzle){
	f+=box.str()+'\n';
}

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

download("sample.xw",f);

var acrossStr = "!across\n";
var acrosses = document.querySelector("#root > div > div > div.app-mainContainer--3CJGG > div > main > div.layout > div.Layout-unveilable--3OmrG > article > section.Layout-clueLists--10_Xl > div:nth-child(1) > ol").children;
for(var i of acrosses){
	acrossStr+=i.children[0].innerHTML+",,"+i.children[1].innerHTML+'\n';
}
console.log(acrossStr);

var downStr = "!down\n";
var downs = document.querySelector("#root > div > div > div.app-mainContainer--3CJGG > div > main > div.layout > div.Layout-unveilable--3OmrG > article > section.Layout-clueLists--10_Xl > div:nth-child(2) > ol").children;
for(var i of downs){
	downStr+=i.children[0].innerHTML+",,"+i.children[1].innerHTML+'\n';
}

var clueF = acrossStr+downStr;

download("sample.clue",clueF);