let textArea = document.getElementById("textArea");
let list = document.getElementById("listContainer");
let boxList = document.querySelectorAll(".isDone");
let listItem;
let actionCont;
let database = [];
let modal = {};

getTodos(function(dataList){
    database = dataList;

    dataList.forEach(function(item){

        listItem = document.createElement("div");
        listItem.classList.add("listItem");
        listItem.setAttribute("id",item.id);
        actionCont = document.createElement("div");
        actionCont.classList.add("actionCont");
        let checkBox = document.createElement("input");
        checkBox.setAttribute("type","checkbox");
        checkBox.classList.add("isDone");
        checkBox.setAttribute("id",`chk${item.id}`);
        checkBox.addEventListener('change',checkBoxFunction);
        let title = document.createElement("span");
        title.innerText = item.data;
        let deleteImg = document.createElement("img");
        deleteImg.setAttribute("src","close.png");
        deleteImg.classList.add("deleteClass");
        deleteImg.setAttribute("id",`img${item.id}`);
        deleteImg.classList.add("image");
        let todoPic = document.createElement("img");
        todoPic.setAttribute('src',item.filename);
        deleteImg.addEventListener('click',removeFunction);

        if(item.isChecked){
            checkBox.checked = 1;
            title.style = "text-decoration: line-through;";
        }

        actionCont.append(todoPic,checkBox,deleteImg);
        listItem.append(title,actionCont);
        list.appendChild(listItem);
    });
});



function checkBoxFunction(event){
    let title = event.target.parentElement.previousSibling;
    modal = {};
    database.forEach(function(value,key){
        if(value.id == (event.target.id).slice(3)){
            modal = value;
            if(database[key].isChecked == 1){
                database[key].isChecked = 0;
                title.style = "text-decoration: none;"
            }else{
                database[key].isChecked = 1;
                title.style = "text-decoration: line-through;"
            }
        }
    });
    postTodo(modal,()=>{})    
}

function removeFunction(event){
    let element = event.target.parentElement.parentElement;
    database.forEach(function(value,key){
        if(value.id == (event.target.id).slice(3)){
            database.splice(key,1);
            // localStorage.setItem("database",JSON.stringify(database));
        }
    });
    
    let childToBeRemoved = document.getElementById((event.target.id).slice(3));
    deleteTodo( { id: childToBeRemoved.id } ,function(){
        list.removeChild(childToBeRemoved);
    });

}


function postTodo(obj,callback){
    let request = new XMLHttpRequest();
    request.open('POST','/saveTodo');
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify(obj));
    request.addEventListener('load',function(){
        if(request.status === 200){
            callback();
        }else{
            // error not posted;
        }
    });
} 

function getTodos(callback){
    let request = new XMLHttpRequest();
    request.open('GET','/getTodo');
    request.send();
    request.addEventListener('load',function(){
        if(request.status === 200){
            callback(JSON.parse(request.responseText));
        }else{
            // error not posted;
        }
    });
}

function deleteTodo(obj,callback){
    let request = new XMLHttpRequest();
    request.open('POST','/deleteTodo');
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify(obj));
    request.addEventListener('load',function(){
        if(request.status === 200){
            callback();
        }else{
            // error not posted;
        }
    });
}