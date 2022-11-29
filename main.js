const express = require('express')
const fs = require('fs');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const { dirname } = require('path');
const app = express()
const port = 3000

app.use(express.urlencoded({extended:false}));
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.json());


app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.post('/saveTodo',upload.single('todoPic'),(req,res) => {
	let node = req.body;
    if(req.file != undefined){
        node.filename = req.file.filename;
        node.id = req.file.filename;
    }
	let already = -1;
	console.log(req.url);
	// console.log("obj sent from form =>",node);
	fs.readFile('database.txt','utf-8',(err,data)=>{
		let list = [];
		if(!err){
			if(data.length != 0){
				list = JSON.parse(data);
			}
			list.forEach(function(item,key){
				if(node.id == item.id){
					already = key;
				}
			});
			if(already != -1){
				list[already].data = node.data;
				list[already].isChecked = node.isChecked;
			}else{
                node.isChecked = 0;
				list.push(node);
                res.redirect('/');
			}
		}else{
			  //error handling here!!
		}	
		fs.writeFile('database.txt',JSON.stringify(list),function(err){
			if(!err){
				res.end();
			}else{
				//error handling here!!
			}
		});
	});
});


app.get('/getTodo',(req,res)=>{
	console.log(req.url);
	fs.readFile('database.txt','utf-8',(err,data)=>{
		if(!err){
			if(data.length != 0){
				// console.log(data);
				res.end(data);
			}
		}else{
			  //error handling here!!
		}	
	});
});

app.post('/deleteTodo',(req,res)=>{
	let givenId = req.body;
	console.log(req.url);
	fs.readFile('database.txt','utf-8',(err,data)=>{
		let list = [];
		if(!err){
			if(data.length != 0){
				list = JSON.parse(data);
			}
			list.forEach(function(item,key){
				if(givenId.id == item.id){	
					list.splice(key,1);
				}
			});
		}else{
			  //error handling here!!
		}	


		fs.writeFile('database.txt',JSON.stringify(list),function(err){
			if(!err){
				res.end();
			}else{
				//error handling here!!
			}
		});
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
