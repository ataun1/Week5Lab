let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let Task = require('./models/task');
let Developer = require('./models/developer');
// let mongodb  = require('mongodb');

// let MongoClient = mongodb.MongoClient;

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

// url = "mongodb://localhost:27017";
// MongoClient.connect(url, {useNewUrlParser: true}, function (err,client){
//     if (err){
//         console.log("Err "+ err);
//     }
//     else{
//         console.log("Successfully connected to server");
//         db = client.db("week6");
//         col = db.collection('tasks');
//     }
// })

mongoose.connect('mongodb://localhost:27017/todoDB', function(err){
    if (err){
        console.log('Error in mongoose connection');
        throw err;
    }
    console.log('Successfully connected');
} )


app.get('/', function (request, response) {
    //response.render('index.html');
    response.sendFile(viewPaths + "index.html");
})

app.get('/newtask', function (request, response) {
    response.render('newtask.html')
})


app.get('/insertdeveloper', function (request, response) {
    response.render('insertdev.html')
})


app.get('/getdeveloper', function (request, response) {
    response.render('getdev.html')
})

app.get('/listtasks', function (request, response) {
    // response.render('listtask.html', { taskdb: db });
    Task.find({}, function(err,result){
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

app.get('/getdeveloper', function(request,response){
    Developer.find().exec(function(err, result){
        if (err){
            console.log("error")
            response.redirect('/404');
        }else{
            response.render('getdev.html', {devdb: result})
        }
    })
})

app.get('/extra', function (request, response){
    Task.find({'taskStatus': 'Complete'}, function(err, docs){
        if (err) throw err;
        response.render('extra.html', {taskdb: docs})
    }).sort({taskName:-1}).limit(3)
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
    
    let task = new Task({
        taskID: new mongoose.Types.ObjectId(),
        taskName: taskDetails.taskname,
        assignTo: mongoose.Types.ObjectId(id),
        taskDue: new Date(taskDetails.taskdue),
        taskStatus: taskDetails.status,
        taskDesc: taskDetails.taskdesc
    });
    task.save(function(err){
        if (err) throw err;
        console.log("Task successfully added to DB");
    })
    
    response.redirect('/listtasks')
    //response.render('listtask.html', { taskdb: db });
});


app.post('/deletebyID', function(request,response){
    let taskDetails = request.body;
    console.log(taskDetails);
    Task.deleteOne({_id: taskDetails.taskid}, function(err, obj) {
        console.log(obj.result);
    });
    response.redirect('/listtasks')
})

app.post('/deleteAll', function(request,response){
    Task.deleteMany({taskStatus: 'Complete'}, function(err, obj){
        console.log(obj.result);
    })
    response.redirect('/listtasks')

})

app.post('/update', function(request,response){
    taskDetails = request.body;
    //console.log(taskDetails);
    Task.updateOne({_id: taskDetails.taskid}, {$set : {taskStatus: taskDetails.status}}, function(err,obj){
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
    Task.insertMany(taskList);
    response.redirect('/listtasks')
})

app.post('/insertdev', function(request, response){
    devDetails = request.body;
    let dev = new Developer({
        name: {
            firstname: devDetails.firstname,
            lastname: devDetails.lastname
        },
        level: devDetails.level,
        address: {
            street: devDetails.street,
            suburb: devDetails.suburb,
            state: devDetails.state,
            unit: devDetails.unit
        }
    });
    dev.save(function(err){
        if (err){
            throw (err);
        }
        console.log("Developer successfully added to database");
        response.redirect('/listtasks')
    })
})

app.listen(8080);