var COLOR = {"black":[0,0,0], "gray":[170,170,170], "white":[255,255,255], "red":[255,0,0], "green":[0,255,0], "blue":[0,0,255], "pink":[255,0,255], "yellow":[255,255,0], "cyan":[0,255,255],"bk":[0,0,0], "gy":[170,170,170], 'w':[255,255,255], 'r':[255,0,0], 'g':[0,255,0], 'b':[0,0,255], 'p':[255,0,255], 'y':[255,255,0], 'c':[0,255,255]};
var randomMate = true;
var noSelection = true;
var noMutation = true;
var maxGen = 3;
var t = 1;
var pops = [];
var spls = [];
var WIN = 500;
var mpercent = .03125;
var phenotypes = "aAm";
var dominantP = [-1], mutantP = [-1], recessiveP = [-1];

$(document).ready(function() {
    $(document).on("submit","#cmdfrm",function() {
        Console(document.getElementById("cmd").value);
        return false;
    });
});

function findPop(idPop) {for (let i = 0; i < pops.length; i++) {if (pops[i].id == idPop) {return pops[i];}}}
function findSpecies(specName) {for (let i = 0; i < spls.length; i++) {if (spls[i].name == specName) {return spls[i];}}}
function sleep(s) {return new Promise(resolve => setTimeout(resolve, s*1000));}
function error(errMsg) {alert("ERROR: "+errMsg);}
function cout(msg) {console.log(msg);}
function SCREEN_W() {return Math.max(document.body.scrollWidth,document.documentElement.scrollWidth,document.body.offsetWidth,document.documentElement.offsetWidth,document.documentElement.clientWidth);}
function SCREEN_H() {return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight,document.body.offsetHeight,document.documentElement.offsetHeight,document.documentElement.clientHeight);}

class species {
    constructor(name, Color,isProducer, tl) {
        this.name = name;
        this.clr = Color;
        this.edibleSpecies = [];
        this.subpop = [];
        this.producer = isProducer;
        this.TrophicLevel = tl;
    }
}

templateS = new species("Mysterious Wanderer", [0,0,255],true, 1);
spls.push(templateS);

class Pop {
	constructor(position, Color, parents, spcs) {
		this.alive = true;
        this.energy = 100;
		this.gtype = "";
        this.spc = null;
        if (spcs == null) {this.spc = findSpecies("Mysterious Wanderer");}
        else {this.spc = spcs;}
		if (parents != null) {
			for (let i = 0; i < 2; i++) {this.gtype += parents[i].gtype[Math.floor(Math.random()*2)]};
			this.gen = parents[0].gen+1;
			if (this.gen >= maxGen) {
				cout(">Cannot exceed F" + maxGen.toString());
				this.alive = false;
				return;
			}
		}
		else {
            this.energy = 100;
			for (let i = 0; i < 2; i++) {this.gtype += phenotypes[Math.floor(Math.random()*3)];}
			this.gen = 0;
		}
		if (!Math.floor(Math.random()*(1/mpercent)) && !noMutation) {this.gtype = this.gtype[0]+'m'}
		this.gender = Math.floor(Math.random()*3) ? "-m" : "-f";
		if (this.gtype.includes('A')) {
			this.clr = dominantP;
			this.gtype = (this.gtype[0] != 'A') ? 'A' + this.gtype[0] : this.gtype;
		}
		else if (this.gtype.includes('m')) {this.clr = mutantP;}
		else {this.clr = recessiveP;}
		if (this.clr == -1) {this.clr = (Color == null) ? this.parents[0].map(function (rgbd, i) {(rgbd+this.parents[1][i])/2}) : Color;}
		this.attracted = false;
		this.pregnant = false;
		this.id = 10000000;
		while (findPop(this.id)) {this.id = Math.floor((Math.random()*89999999) + 10000000)}
		this.pos = position;
        this.age = 0;
        this.mateStart();
        pops.push(this);
	}
	async pregnate(father) {
		if (this.alive) {
			this.pregnant = true;
			this.attracted = false;
			await sleep(t*5);
			new Pop(this.pos, null, [this,father],this.spc);
			this.pregnant = false;
		}
	}
    async mateStart() {await sleep(7.5);this.mate();}
	async mate() {
        setInterval(async function() {
        if (this.gen+1 > maxGen) {setTimeout(this.mate, 100);return;}
        this.attracted = true;
        if (this.gender == "-f") {
            while (this.attracted) {continue;}
            setTimeout(mate, 100);
            return;
        }
        for (let i = 0; i < pops.length; i++) {
            if (pops[i].gender == "-f" && pops[i].atracted) {
                if (Math.sqrt(((pops[i].pos[0]-this.pos[0])**2) + ((pops[i].pos[1]-this.pos[0])**2)) <= 50) {
                    this.pos = pops[i].pos;
                    if (!pops[i].pregnant) {pops[i].pregnate(this)}
}}}
    }, t*3500);}}

function colorize(Color) {
	if (isNaN(parseInt(Color[0]))) {
		Color = COLOR[Color[0]];
		if (Color == undefined) {error("Unknown color");}
	}
	else {for (let i = 0; i < Color.length; i++) {Color[i] = parseInt(Color[i])}}
	return Color;
}

function sab(cin, v, msg) {
	if (cin.length == 2) {error(isNaN(parseInt(cin[1])) ? "No `int` was provided" : "Unknown operation used");}
	else if (cin.length == 1) {cout(">"+msg+": "+v);}
	else {
		if (isNaN(parseInt(cin[2]))) {error("2nd command arg must be type `int`");}
		if (cin[1] == "set" || cin[1] == "=") {v = parseInt(cin[2])}
		else if (cin[1] == "add" || cin[1] == "+") {v += parseInt(cin[2]);}
		else if (cin[1] == "sub" || cin[1] == "-") {v -= parseInt(cin[2]);}
		else {error("Unknown option [valid options are set(=),add(+),sub(-)]");}
	}
}

Array.prototype.removeAll = function(opt) {while (this.includes(opt)) {this.splice(this.indexOf(opt),1);}}
var cin = "";

function Console(cin) {
	if (cin == undefined) {
		error("Command is empty");
		return;
	}
	cin = cin.split(' ');
	if (cin[0] == "kill") {
		if (cin.includes("-r")) {
			cin.removeAll("-r");
			if (!isNaN(parseInt(cin[1]))) {
				if (parseInt(cin[1]) > pops.length) {error("Selected no. of pops cannot be greater than actual no. of pops");}
				else {for (let i = 0; i < parseInt(cin[1]); i++) {pops.splice(Math.floor(Math.random*pops.length),1)}}
			}
			else {error((cin.length > 1) ? "No. of pops must be type `int`" : "No. of pops not provided")}
		}
	}
	else if (cin[0] == "paint") {
		cin.removeAll("paint");
		let Color = [];
		for (let i = 0; i < cin.length; i++) {if (cin[i][0] != '-') {Color.push(cin[i]);}}
		Color = colorize(Color);
		let paintopt = (opt,contains) => {if (cin.includes(opt)) {for (let i = 0; i < pops.length; i++) {if (pops[i].gtype.includes(contains)) {pops[i].clr = Color;}}}}
		paintopt("-a",'',false);
		paintopt("-r", "aa",false);
		paintopt("-d",'A',false);
		if (cin.includes("-m") != cin.includes("-f")) {for (let i = 0; i < pops.length; i++) {if (cin.includes(pops[i].gender)) {pops[i].clr = Color;}}}
	}
	else if (cin[0] == "pheno") {
		if (cin.length < 3) {
			error("Insufficient args");
			return;
		}
		if (cin[1] == "dom") {dominantP = colorize(cin[2]);}
		else if (cin[1] == "rec") {recessiveP = colorize(cin[2]);}
		else if (cin[1] == "mut") {
			mutantP = colorize(cin[2])
			noMutation = false;
		}
		else {error("Second arg must be 'dom', 'mut', or 'rec'");}
	}
	else if (cin[0] == "spawn") {
		let Color = [];
		if (cin.includes("-c")) {
			Color = colorize(cin.join('').split("-c")[1].split());
			if (Color == undefined) {return;}
			cin = cin.join(' ').split("-c")[0].split(' ');
			cin.pop();
		}
		let j = parseInt(cin[1]);
		if (isNaN(j)) {j=1;}
		for (let i = 0; i < j; i++) {new Pop([Math.floor(Math.random()*WIN),Math.floor(Math.random()*WIN)], Color.length < 3 ? /*SPECIES COLOR*/[0,255,255] : Color, null,null);}
    }
    else if (cin[0] == "species") {
        if (cin[1] == "add") {
            let isProducer = false;
            if (cin.includes("-p")) {isProducer=true;cin = cin.join(' ').split("-p")[0].split(' ');}
            spls.push(new species(cin[2], cin[3], isProducer));
        }
    }
	else if (cin[0] == "ls") {for (let [i,k] of pops.entries()) {cout(">ID="+k.id+" SPECIES="+k.spc.name+" ENERGY="+k.energy+" GENOTYPE="+k.gtype+" GENERATION=F"+k.gen+" GENDER="+k.gender[1]+" COLOR="+k.clr+(i != pops.length ? ',' : ''));}}
	else if (cin[0] == "tick") {t = sab(cin,t,"TICK SPEED");}
	else if (cin[0] == "maxgen") {maxGen = sab(cin,maxGen,"MAX GENERATION");}
	else {error("Unknown command");}
    return false;
}

function setup() {
    createCanvas(750,WIN);
    setTimeout(main, 1000);
}

function main() {
    for (let i = 0; i < pops.length; i++) {
    for (let j = 0; j < 2; j++) {pops[i].pos[j] += Math.floor((Math.random()*3)-1)*(new Array(0,5,10,25,50)[Math.floor(Math.random()*5)]);if (pops[i].pos[j] >WIN) pops[i].pos[j] -= 50;else if (pops[i].pos[j]<0) {pops[i].pos[j]+=50;}}
        pops[i].energy -= 0.5;
        if (pops[i].spc.producer) {pops[i].energy += 2}
        else if (pops[i].energy <= 0) {pops[i].age = (t*2700)-1;}
        else if (pops[i].energy < 50) {
            let speciesTarget = pops[i].spc.edibleSpecies[Math.floor(Math.random()*pops[i].spc.edibleSpecies.length)];
            let target = speciesTarget.subpop[Math.floor(Math.random()*(speciesTarget.subpop.length))]
            if (target == undefined) {continue;}
            if (Math.floor(Math.random()*2)) {
                pops[i].energy += target.energy*(.1**speciesTarget.TrophicLevel);
                pops.splice(pops.indexOf(target),1);
                speciesTarget.subpop.splice(speciesTarget.subpop.indexOf(target), 1);
            }
            else {pops[i].energy -= 0.5;}
        }
    }
    setTimeout(main, t*100);
}

function draw() {
    background(200);
    for (let i = 0; i < pops.length; i++) {
        fill("rgb("+pops[i].clr.join()+')');
        rect(pops[i].pos[0],pops[i].pos[1],20,20);
        
        if (pops[i] == undefined) {return;}
        pops[i].age++;
        if (pops[i].age == t*2700) {pops.splice(i,1);}
    }
    for (let i = 0; i < spls.length; i++) {
        fill(spls[i].clr);
        let energySum = 0;
        for (let j = 0; j < spls[i].subpop.length; j++) {energySum += spls[i].subpop[j].energy;}
        rect(500, (i*50)+250, energySum, 30);
    }
}