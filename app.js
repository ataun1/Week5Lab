let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let db = [];
let viewPaths = __dirname + "/views/"

app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json());

app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('images'));
app.use(express.static('css'));

app.get('/', function(request,response){
    //response.render('index.html');
    response.sendFile(viewPaths+ "index.html");
})

app.get('/newtask', function(request, response){
    response.render('newtask.html')
})

app.get('/listtasks', function(request,response){
    response.render('listtask.html',{taskdb: db});
})

app.post('/task', function(request,response){
task = {
    taskName : request.body.taskname,
    taskDue : request.body.taskdue,
    taskDesc : request.body.taskdesc
}
console.log(task);
db.push(task);

response.render('listtask.html',{taskdb:db});
});

app.listen(8080);