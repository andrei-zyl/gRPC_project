const fs = require('fs');
var grpc = require('grpc');
var greets = require('../server/protos/greet_pb');
var service = require('../server/protos/greet_grpc_pb');
var sum_pb = require('../server/protos/sum_pb');
var sumService = require('../server/protos/sum_grpc_pb');
var blogs = require("../server/protos/blog_pb");
var blogService = require("../server/protos/blog_grpc_pb");

let credentials = grpc.credentials.createSsl(
    fs.readFileSync('../certs/ca.crt'),
    fs.readFileSync('../certs/client.key'),
    fs.readFileSync('../certs/client.crt')
);

let unsafeCreds = grpc.credentials.createInsecure();

function callGreetings(){
    console.log('Hello from client!')
    var client = new service.GreetserviceClient('localhost:50051', unsafeCreds);

    var request = new greets.GreetRequest();
    var greeting = new greets.Greeting();
    
    greeting.setFirstName('Andrei');
    greeting.setLastName('Zyl');

    request.setGreeting(greeting);

    client.greet(request, (error, response) => {
        if(!error) console.log('Greeting response: ', response.getResult());
        else{console.error(error)}
    });
}

function callSum(){
    var client_sum = new sumService.SumServiceClient('localhost:50051', grpc.credentials.createInsecure());

    var request_sum = new sum_pb.SumRequest();
    var adding = new sum_pb.Adding();
    
    adding.setFirst(7);
    adding.setSecond(8);

    request_sum.setAddRequest(adding);

    client_sum.sum(request_sum, (error, response) => {
        if(!error) console.log('Sum response: ', response.getResult());
        else{console.error(error)}
    })
}

function callGreetManyTimes(){
    var client = new service.GreetserviceClient('localhost:50051', grpc.credentials.createInsecure());
    var request = new greets.GreetManyTimesRequest();

    var greeting = new greets.Greeting();
    
    greeting.setFirstName('Andrei');
    greeting.setLastName('Zyl');

    request.setGreeting(greeting);

    var call = client.greetManyTimes(request, () => {});

    call.on('data', (response) => {
        console.log('Client streaming response: ', response.getResult());
    });

    call.on('status', (status) => {
        console.log('Status: ', status);
    });

    call.on('error', (error) => {
        console.error(error);
    });

    call.on('end', () => {
        console.error('Streaming ended!');
    });
}

function callSumManyTimes(){
    var client = new sumService.SumServiceClient('localhost:50051', grpc.credentials.createInsecure());
    var request = new sum_pb.SumManyTimesRequest();

    var adding = new sum_pb.Adding();
    
    adding.setFirst(1200); 

    request.setAddRequest(adding);

    var call = client.sumManyTimes(request, () => {});

    call.on('data', (response) => {
        console.log(response.getResult())
    });

    call.on('status', (status) => {
        console.log('Status: ', status);
    });

    call.on('error', (error) => {
        console.error(error);
    });

    call.on('end', () => {
        console.error('Streaming ended!');
    });
}

function callLongGreeting(){
    var client = new service.GreetserviceClient('localhost:50051', grpc.credentials.createInsecure());
    var request = new greets.LongGreetRequest();
    var call = client.longGreet(request, (error, response) => {
        if(!error) console.log('Server response: ', response.getResult());
        else{console.error(error)}
    });

    let count = 0;
    let intervalID = setInterval(function(){
        console.log('Sending Message ', count);
        var request = new greets.LongGreetRequest();
        var greeting = new greets.Greeting();
    
        greeting.setFirstName('Andrei');
        greeting.setLastName('Zyl');
        request.setGreeting(greeting);

        call.write(request);

        if(++count > 5){
            clearInterval(intervalID);
            call.end();
        }

    }, 1000);
}

function callAverage(arr){
    var client = new sumService.SumServiceClient('localhost:50051', grpc.credentials.createInsecure());
    var request = new sum_pb.AverageRequest();

    var call = client.average(request, (error, response) => {
        if(!error) console.log('Server response (average): ', response.getResult());
        else{console.error(error)}
    })

    let streamArray = arr.map(el => {
        var request = new sum_pb.AverageRequest();
        var array = new sum_pb.AverageArray();
        array.setArray(el)
        request.setAverageArray(array)
        call.write(request);
        console.log(`Element sent: ${el}`)
    })
    call.end();
}

async function sleep(interval){
    return new Promise((res) => {
        setTimeout(() => res(), interval);
    })
}

async function callBiDirect() {
    var client = new service.GreetserviceClient("localhost:50051", insafeCreds);
  
    var call = client.greetEveryone(request, (error, response) => {
      console.log("Server Response: " + response);
    });
  
    call.on("data", response => {
      console.log("Hello Client!" + response.getResult());
    });
  
    call.on("error", error => {
      console.error(error);
    });
  
    call.on("end", () => {
      console.log("Client The End");
    });
  
    for (var i = 0; i < 7; i++) {
      var greeting = new greets.Greeting();
      greeting.setFirstName("Lera");
      greeting.setLastName("Suhareva");
  
      var request = new greets.GreetEveryoneRequest();
      request.setGreeting(greeting);
  
      call.write(request);
  
      await sleep(1500);
    }
  
    call.end();
}

function callMaxNumber(arr){
    var client = new sumService.SumServiceClient("localhost:50051", unsafeCreds);
    var request;

    var call = client.maxNumber(request, (error, response) => {
        console.log("Server Response: " + response);
    });
    
    call.on("data", response => {
        console.log("New Maximum Number Received: " + response.getResult());
    });
    
    call.on("error", error => {
        console.error(error);
    });
    
    call.on("end", () => {
        console.log("Client The End...");
    });
    
    arr.map(el => {
        var number = new sum_pb.MaxNumber();
        number.setNumber(el);
        var request = new sum_pb.MaxNumberRequest();
        request.setMaxNumber(number);
        call.write(request);
    })
    
    call.end();
}

function doErrorCall(){
    var deadline = getRPCDeadLine(1);
    
    var client = new sumService.SumServiceClient("localhost:50051",grpc.credentials.createInsecure());

    var number = 5;
    var request = new sum_pb.SquareRootRequest();
    request.setNumber(number);

    client.squareRoot(request, {deadline}, (error, response) => {
        if(!error) console.log('Square root: ', response.getNumberRoot());
        else{console.error(error.message)}
    })
}

function getRPCDeadLine(rpcType){
    timeAllowed = 5000;
    switch(rpcType){
        case 1: 
            timeAllowed = 10
            break
        case 2:
            timeAllowed = 7000
            break
        default: 
            console.log('Invalid RPC Type. Using default timeout')
    }

    return new Date(Date.now() + timeAllowed);
}

function callListBlogs(){
    var client = new blogService.BlogServiceClient("localhost:50051", unsafeCreds);
    var emptyRequest = new blogs.ListBlogRequest();
    var call = client.listBlog(emptyRequest, () => {});

    call.on("data", response => {
        let a = response.getBlog().toString()
        let b = a.split(',')
        console.log("Client Streaming Response: ", b);
    });

    call.on("error", error => {
        console.error(error);
    });

    call.on("end", () => {
        console.log("Client The End...");
    });
}

function callCreateBlog() {
    var client = new blogService.BlogServiceClient("localhost:50051", unsafeCreds);
  
    var blog = new blogs.Blog();
    blog.setAuthor("Bond");
    blog.setTitle("Bond.. blog post");
    blog.setContent("This is okay...");
  
    var blogRequest = new blogs.CreateBlogRequest();
    blogRequest.setBlog(blog);
  
    client.createBlog(blogRequest, (error, response) => {
        if (!error) {
            console.log("Received create blog response,", response.toString());
        } else {
            console.error(error);
        }
    });
}

function callReadBlog() {
    var client = new blogService.BlogServiceClient("localhost:50051", unsafeCreds);

    var readBlogRequest = new blogs.ReadBlogRequest();
    readBlogRequest.setBlogId('3');

    client.readBlog(readBlogRequest, (error, response) => {
        if (!error) {
            console.log("Found a blog ", response.toString());
        } else {
            if (error.code === grpc.status.NOT_FOUND) {
                console.log("Not found");
            } else {
                //do something else...
            }
        }
    });
}

function callUpdateBlog() {
    var client = new blogService.BlogServiceClient("localhost:50051", unsafeCreds);
  
    var updateBlogRequest = new blogs.UpdateBlogRequest();
  
    var newBlog = new blogs.Blog();
  
    newBlog.setId("1");
    newBlog.setAuthor("Andrei Zyl now");
    newBlog.setTitle("Hello Up to date");
    newBlog.setContent("This is great, again!");
  
    updateBlogRequest.setBlog(newBlog);
  
    console.log("Blog...", newBlog.toString());
  
    client.updateBlog(updateBlogRequest, (error, response) => {
        if (!error) {
        } else {
            if (error.code === grpc.status.NOT_FOUND) {
                console.log("NOt found");
            } else {
                ///do more...
            }
        }
    });
}

function callDeleteBlog() {
    var client = new blogService.BlogServiceClient("localhost:50051", unsafeCreds);
  
    var deleteBlogRequest = new blogs.DeleteBlogRequest();
    var blogId = "3";
  
    deleteBlogRequest.setBlogId(blogId);
  
    client.deleteBlog(deleteBlogRequest, (error, response) => {
        if (!error) {
            console.log("Deleted blog with id: ", response.toString());
        } else {
            if (error.code === grpc.status.NOT_FOUND) {
                console.log("Not Found");
            } else {
                console.log("Sorry something went wrong");
            }
        }
    });
}
function main(){
    callGreetings();
    // callGreetManyTimes();
    // callSumManyTimes();
    // callLongGreeting();
    // callAverage([1,2,3,4,5,6,7,123]);
    // callBiDirect();
    // callMaxNumber([2,6,8,3,5,12,28,21,101,77,100500]);
    // doErrorCall();
    // callListBlogs();
    // callCreateBlog();
    // callReadBlog();
    // callUpdateBlog();
    // callDeleteBlog();
}

main();