var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var server = http.Server(app)
var Article = require('./article.model')

//db connection
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dbURL = 'mongodb://localhost:27017/cw10' //change this if you are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', function (err) {
 console.log(err)
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// your server routes go here
app.get('/', function(request, response){
    //console.log(request)
    console.log(__dirname)
    response.sendFile(__dirname+ '/index.html')
})
//add route for second.html file
app.get('/second', function(request, response){
    response.sendFile(__dirname+ '/second.html')
})
//route for form 
app.get('/article/form', function(request, response){
    response.sendFile(__dirname+ '/form.html')
})


//post request for form
let articles =[{title: 'test1', content: 'test1to'},
            {title: 'test2', content: 'test2to'},
            {title: 'test3', content: 'test3to'},
            {title: 'test4', content: 'test4to'}
        ];
app.post('/article/new', function(request, response){
    // console.log('form data api called')
    // //console.log(request.body)
    // if(request.body.title){
    //     articles.push(request.body)
    //     console.log(articles)
    //     response.json({msg: 'Article submitted'})
    // }else{
    //     response.status(400).json({error: 'title is missing'})
    // }
    var newArticle = new Article(request.body)
    newArticle.save(function (err, data) {
    if (err)
        return response.status(400).json({
            error: 'Title is missing'
        })
        return response.status(200).json({
            message: 'Article created successfully'
        })
    })

})

// add route for article.ejs
app.get('/article/:id', function(request, response){
    console.log(request.params.id)
    // response.render('article.ejs', {
    //     article1: articles[request.params.id]
    // })
    Article.findById(request.params.id, function (err, data) {
        console.log(data)
        response.render('article.ejs', {
          article1: data
        })
    })
     
})

//add route for allArticle.ejs
app.get('/articles/all', function(request, response){
    // response.render('allArticles.ejs', {
    //     article2: articles
    // })
    Article.find({}, function (err, data) {
        response.render('allArticles.ejs', {
          article2: data
        })
      })
     
})



server.listen(process.env.PORT || 3000, 
process.env.IP || 'localhost', function(){
  				console.log('Server running');
})

module.exports = {app, server, mongoose}
