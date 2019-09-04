let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongodb  = require('mongodb');

let MongoClient = mongodb.MongoClient;

let db;
let viewPaths = __dirname + "/views/"

app.use(bodyParser.urlencoded({
    extended: false
}))


//app.use(bodyParser.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('images'));
app.use(express.static('css'));

url = "mongodb://localhost:27017";
MongoClient.connect(url, {useNewUrlParser: true}, function (err,client){
    if (err){
        console.log("Err "+ err);
    }
    else{
        console.log("Successfully connected to server");
        db = client.db("week6");
        col = db.collection('tasks');
    }
})


app.get('/', function (request, response) {
    //response.render('index.html');
    response.sendFile(viewPaths + "index.html");
})

app.get('/newtask', function (request, response) {
    response.render('newtask.html')
})

app.get('/listtasks', function (request, response) {
    // response.render('listtask.html', { taskdb: db });
    db.collection('tasks').find({}).toArray(function(err,result){
        if (err){
            console.log("yes")
            response.redirect('/404');
        }
        else{
            console.log(result);
            response.render('listtask.html',{taskdb: result})
        }
    })
})

app.get('/deletetask', function(request,response){
    response.sendFile(viewPaths +"deletetask.html")
})

app.get('/updatetask', function(request,response){
    response.sendFile(viewPaths+"updatetask.html")
})

app.get('/inserttask', function(request,response){
    response.sendFile(viewPaths+"inserttask.html");
})


app.post('/task', function (request, response) {
    let taskDetails = request.body;
    let id = Math.floor((Math.random() * 1000) + 1);
    col.insertOne({
        taskID: id,
        taskName: taskDetails.taskname,
        assignTo: taskDetails.assignto,
        taskDue: new Date(taskDetails.taskdue),
        taskStatus: taskDetails.status,
        taskDesc: taskDetails.taskdesc
    });
    
    response.redirect('/listtasks')
    //response.render('listtask.html', { taskdb: db });
});


app.post('/deletebyID', function(request,response){
    let taskDetails = request.body;
    console.log(taskDetails);
    col.deleteOne({taskID: parseInt(taskDetails.taskid)}, function(err, obj) {
        console.log(obj.result);
    });
    response.redirect('/listtasks')
})

app.post('/deleteAll', function(request,response){
    col.deleteMany({taskStatus: 'Complete'}, function(err, obj){
        console.log(obj.result);
    })
    response.redirect('/listtasks')

})

app.post('/update', function(request,response){
    taskDetails = request.body;
    //console.log(taskDetails);
    col.updateOne({taskID: parseInt(taskDetails.taskid)}, {$set : {taskStatus: taskDetails.status}}, function(err,obj){
        console.log(obj.result);
    });
    response.redirect('/listtasks')
})

app.post('/insert', function(request,response){
    taskDetails = request.body;
    console.log(taskDetails);
    let taskList = [];
    tCount = parseInt(taskDetails.count);
    console.log(tCount);
    for (let i = 0; i < tCount; i++){
        console.log(i);
        let id = Math.floor((Math.random() * 1000) + 1);
        task = {
            taskID: id,
            taskName: taskDetails.taskname
        }
        taskList.push(task);
    }
    col.insertMany(taskList);
    response.redirect('/listtasks')
})


app.listen(8080);