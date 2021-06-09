PRODUCER = new species("Producer",[0,153,51],true,1);
HERBIVORE = new species("Herbivore",[102, 255, 102],false,2);
CARNIVORE = new species("Carnivore",[255,0,0],false,3);
OMNIVORE = new species("Omnivore",[51, 204, 204],false,2);
HERBIVORE.edibleSpecies.push(PRODUCER);
OMNIVORE.edibleSpecies.push(PRODUCER,HERBIVORE,CARNIVORE);
CARNIVORE.edibleSpecies.push(HERBIVORE)
spls.push(CARNIVORE,OMNIVORE,HERBIVORE,PRODUCER);

function Producer() {PRODUCER.subpop.push(new Pop([Math.floor(Math.random()*WIN),Math.floor(Math.random()*WIN)], [0,153,51],null,findSpecies("Producer")));}
function herbivore() {HERBIVORE.subpop.push(new Pop([Math.floor(Math.random()*WIN),Math.floor(Math.random()*WIN)], [102, 255, 102],null,findSpecies("Herbivore")));}
function carnivore() {CARNIVORE.subpop.push(new Pop([Math.floor(Math.random()*WIN),Math.floor(Math.random()*WIN)],[255,0,0],null,findSpecies("Carnivore")));}
function omnivore() {OMNIVORE.subpop.push(new Pop([Math.floor(Math.random()*WIN),Math.floor(Math.random()*WIN)],[51, 204, 204],null,findSpecies("Omnivore")));}