let categories = {
"Phy Ed":["sport","exercise","run","gym","fitness"],
"Math":["math","algebra","geometry","equation","solve"],
"English":["essay","grammar","poem","novel","literature"],
"Social Studies":["history","government","war","culture","map"],
"Health":["nutrition","sleep","mental","diet","health"],
"Science":["biology","chemistry","physics","lab","experiment"],
"Custom":[]
};

let historyStack = [];
let redoStack = [];

function similarityScore(text, keywords){
text = text.toLowerCase();
let score = 0;

keywords.forEach(word=>{
if(text.includes(word)) score++;
});

return score;
}

function sortData(){

const textArea = document.getElementById("inputText");
const lines = textArea.value.split("\n").filter(l=>l.trim()!=="");

const customName = document.getElementById("customCategory").value.trim();
if(customName!==""){
categories["Custom"]=[customName.toLowerCase()];
}

lines.forEach(line=>{

let bestCat=null;
let bestScore=0;

for(let cat in categories){

let score = similarityScore(line,categories[cat]);

if(score>bestScore){
bestScore=score;
bestCat=cat;
}

}

if(bestScore<1 || bestCat==="Custom"){
let ask = prompt("AI is unsure. Enter category for:\n"+line);

if(ask){
if(!categories[ask]) categories[ask]=[];
learnKeyword(ask,line);
bestCat=ask;
}
}

saveData(bestCat,line);
historyStack.push({action:"add",category:bestCat,text:line});

});

textArea.value="";
displayFolders();
}

function learnKeyword(category,text){
let words=text.toLowerCase().split(" ");

words.forEach(w=>{
if(w.length>4 && !categories[category].includes(w)){
categories[category].push(w);
}
});
}

function saveData(category,text){

let stored=JSON.parse(localStorage.getItem(category))||[];

if(!stored.includes(text)){
stored.push(text);
localStorage.setItem(category,JSON.stringify(stored));
}

}

function deleteItem(category,index){

let stored=JSON.parse(localStorage.getItem(category))||[];
let removed=stored.splice(index,1);

localStorage.setItem(category,JSON.stringify(stored));

historyStack.push({
action:"delete",
category:category,
text:removed[0]
});

displayFolders();
}

function undoAction(){

let last=historyStack.pop();
if(!last) return;

if(last.action==="add"){
let data=JSON.parse(localStorage.getItem(last.category))||[];
data.pop();
localStorage.setItem(last.category,JSON.stringify(data));
}

if(last.action==="delete"){
saveData(last.category,last.text);
}

redoStack.push(last);

displayFolders();
}

function redoAction(){

let action=redoStack.pop();
if(!action) return;

if(action.action==="add"){
saveData(action.category,action.text);
}

displayFolders();
}

function clearAll(){
if(confirm("Delete ALL data?")){
localStorage.clear();
displayFolders();
}
}

function searchData(){

let search=document.getElementById("searchBar").value.toLowerCase();

displayFolders(search);
}

function displayFolders(search=""){

const output=document.getElementById("output");
output.innerHTML="";

for(let cat in categories){

let data=JSON.parse(localStorage.getItem(cat))||[];

if(search){
data=data.filter(d=>d.toLowerCase().includes(search));
}

if(data.length===0) continue;

let folder=document.createElement("div");
folder.className="folder";

let title=document.createElement("h3");
title.textContent="📁 "+cat;

folder.appendChild(title);

data.forEach((item,index)=>{

let p=document.createElement("p");
p.textContent="• "+item;

p.onclick=()=>{
if(confirm("Delete this item?")){
deleteItem(cat,index);
}
};

folder.appendChild(p);

});

output.appendChild(folder);
}

}

displayFolders();
