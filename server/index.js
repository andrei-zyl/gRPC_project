const fs = require('fs');
var grpc = require('grpc');
var greets = require('../server/protos/greet_pb');
var service = require('../server/protos/greet_grpc_pb');
var sum_pb = require('../server/protos/sum_pb');
var sumService = require('../server/protos/sum_grpc_pb');
var blogs = require("../server/protos/blog_pb");
var blogService = require("../server/protos/blog_grpc_pb");

//Knex settings
const environment = process.env.ENVIRONMENT || 'development';
const config = require('./knexfile')[environment];
const knex = require('knex')(config);

function greet(call, callback){
    var greeting = new greets.GreetResponse();

    greeting.setResult('Hello ' + call.request.getGreeting().getFirstName() + ' ' + call.request.getGreeting().getLastName());

    callback(null, greeting);
}

function greetManyTimes(call, callback){
    var firstName = call.request.getGreeting().getFirstName();
    let count = 0;
    let intervalID = setInterval(function(){
        var greetManyTimesResponse = new greets.GreetManyTimesResponse();
        greetManyTimesResponse.setResult(firstName + `; count = ${count}`);
    
        // setup streaming
        call.write(greetManyTimesResponse);
        if(++count > 9){
            clearInterval(intervalID);
            call.end();
        }
    }, 1000);
}

function longGreet(call, callback){
    call.on('data', request => {
        var fullName = request.getGreeting().getFirstName() + ' ' + request.getGreeting().getLastName();
        console.log('Hello ' + fullName);
    });

    call.on('error', (error) => {
        console.error(error);
    });

    call.on('end', () => {
        var response = new greets.LongGreetResponse();
        response.setResult('Long Greet Client Streaming...');
        callback(null, response);
    });
}

async function sleep(interval){
    return new Promise((res) => {
        setTimeout(() => res(), interval);
    })
}

async function greetEveryone(call, callback){
    
    call.on('data', request => {
        var fullName = request.getGreeting().getFirstName() + ' ' + request.getGreeting().getLastName();
        console.log('Hello ' + fullName);
    });

    call.on('error', (error) => {
        console.error(error);
    });

    call.on('end', () => {
        console.log('Server The End......');
    });

    for(let i = 0; i < 10; i++){
        var response = new greets.GreetEveryoneResponse();
        response.setResult('Andrei Zyl');

        call.write(response);
        await sleep(1000);
    }

    call.end();
}

function sum(call, callback){
    var adding = new sum_pb.SumResponse();

    var sum_total = call.request.getAddRequest().getFirst() + call.request.getAddRequest().getSecond()
    adding.setResult(sum_total);

    callback(null, adding);
}

function sumManyTimes(call, callback){
    var first = call.request.getAddRequest().getFirst();
    let k = 2;
    
    while(first > 1){
        if(first % k == 0){
            var sumManyTimesResponse = new sum_pb.SumManyTimesResponse();
            sumManyTimesResponse.setResult(k);
            call.write(sumManyTimesResponse);
            first /= k;
        }else{
            k +=1
        }
    }
    call.end();
}

function average(call, callback){
    let sum = 0
    count = 0;
    call.on('data', request => {
        sum+=request.getAverageArray().getArray();
        count++
        console.log(`Element received = ${request.getAverageArray().getArray()}, count = ${count}`)
    })

    call.on('error', (error) => {
        console.error(error);
    });

    call.on('end', () => {
        var response = new sum_pb.AverageResponse();
        response.setResult(sum/count);
        callback(null, response);
    });
}

function maxNumber(call, callback){
    let currentNumber = 0;
    let maxNumber = 0;

    call.on('data', request => {
        currentNumber = request.getMaxNumber().getNumber();
        console.log('Number received: ' + currentNumber);

        if(currentNumber > maxNumber){
            maxNumber = currentNumber;
            var response = new sum_pb.MaxNumberResponse();
            response.setResult(maxNumber);
        
            call.write(response);
        }
    });

    call.on('error', (error) => {
        console.error(error);
    });

    call.on('end', () => {
        console.log('Server The End......');
        call.end();
    });
}

function squareRoot(call, callback){
    var number = call.request.getNumber();

    if(number >= 0){
        var numberRoot = Math.sqrt(number);
        var response = new sum_pb.SquareRootResponse();
        response.setNumberRoot(numberRoot);

        callback(null, response);
    }else{
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: 'The number is not positive!'
        })
    }
}

function listBlog(call, callback){
    console.log('Received ListBlog Request');
    knex('blogs').then(data => {
        data.forEach(element => {
            var blog = new blogs.Blog();
            blog.setId(element.id);
            blog.setAuthor(element.author);
            blog.setTitle(element.title);
            blog.setContent(element.content);

            var blogResponse = new blogs.ListBlogResponse();
            blogResponse.setBlog(blog);

            call.write(blogResponse);
        });
        call.end();
    });
}

function createBlog(call, callback) {
    console.log("Received Create Blog Request");
  
    var blog = call.request.getBlog();
  
    console.log("Inserting a Blog...");
  
    knex("blogs")
        .insert({
            author: blog.getAuthor(),
            title: blog.getTitle(),
            content: blog.getContent()
        })
        .then(() => {
            var id = blog.getId();
    
            var addedBlog = new blogs.Blog();
    
            //set the blog response to be returned
            addedBlog.setId(id);
            addedBlog.setAuthor(blog.getAuthor());
            addedBlog.setTitle(blog.getTitle());
            addedBlog.setContent(blog.getContent());
    
            var blogResponse = new blogs.CreateBlogResponse();
    
            blogResponse.setBlog(addedBlog);
    
            console.log("Inserted Blog with ID: ", addedBlog.getId());
    
            callback(null, blogResponse);
    });
}

function readBlog(call, callback) {
    console.log("Received Blog request");
  
    // get id
    var blogId = call.request.getBlogId();
  
    knex("blogs")
        .where({ id: parseInt(blogId) })
        .then(data => {
            console.log("Searching for a blog...");
    
            if (data.length) {
                var blog = new blogs.Blog();
        
                console.log("Blog found and sending message");
        
                //set the blog response to be returned
                blog.setId(blogId);
                blog.setAuthor(data[0].author);
                blog.setTitle(data[0].title);
                blog.setContent(data[0].content);
        
                var blogResponse = new blogs.ReadBlogResponse();
                blogResponse.setBlog(blog);
        
                callback(null, blogResponse);
            } else {
                console.log("Blog not found");
                return callback({
                    code: grpc.status.NOT_FOUND,
                    message: "Blog Not found!"
                });
            }
    });
}

function updateBlog(call, callback) {
    console.log("Received updated Blog Request");

    var blogId = call.request.getBlog().getId();

    console.log("Searching for a blog to update....");

    knex("blogs")
        .where({ id: parseInt(blogId) })
        .update({
            author: call.request.getBlog().getAuthor(),
            title: call.request.getBlog().getTitle(),
            content: call.request.getBlog().getContent()
        })
        .returning()
        .then(data => {
            if (data) {
                var blog = new blogs.Blog();

                console.log("Blog found sending message...");

                //set the blog response
                blog.setId(blogId);
                blog.setAuthor(data.author);
                blog.setTitle(data.title);
                blog.setContent(data.content);

                var updateBlogResponse = new blogs.UpdateBlogResponse();
                updateBlogResponse.setBlog(blog);

                console.log("Updated ===", updateBlogResponse.getBlog().getId());

                callback(null, updateBlogResponse);
            } else {
                return callback({
                    code: grpc.status.NOT_FOUND,
                    message: "Blog with the corresponding id was not found"
                });
            }
        });
}

function deleteBlog(call, callback) {
    console.log("Received Delete Blog request");
  
    var blogId = call.request.getBlogId();
  
    knex("blogs")
        .where({ id: parseInt(blogId) })
        .delete()
        .returning()
        .then(data => {
            console.log("Blog deleting...");
    
            if (data) {
                var deleteResponse = new blogs.DeleteBlogResponse();
                deleteResponse.setBlogId(blogId);
        
                console.log(
                    "Blog request is now deleted with id: ",
                    deleteResponse.toString()
                );
    
                callback(null, deleteResponse);
            } else {
                console.log("Nope....");
    
                return callback({
                    code: grpc.status.NOT_FOUND,
                    message: "Blog with the corresponding id was not found"
                });
            }
      });
}
  
function main(){
    let credentials = grpc.ServerCredentials.createSsl(
        fs.readFileSync('../certs/ca.crt'),
        [{
            cert_chain: fs.readFileSync('../certs/server.crt'),
            private_key: fs.readFileSync('../certs/server.key')
        }],
        true
    );

    let insafeCreds = grpc.ServerCredentials.createInsecure();
    
    var server = new grpc.Server();
    server.addService(service.GreetserviceService, {greet, greetManyTimes, longGreet, greetEveryone});
    server.addService(sumService.SumServiceService, {sum, sumManyTimes, average, maxNumber, squareRoot});
    server.addService(blogService.BlogServiceService, {listBlog, createBlog, readBlog, updateBlog, deleteBlog});
    server.bind('127.0.0.1:50051', insafeCreds);
    server.start();

    console.log('Server running on port 127.0.0.1:50051...');
}

main();