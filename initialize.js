//initialize a transaction to paystack

var http = require('http');
var https = require('https');
var url = require('url');
var post;
var data='';
//make a server
var server = http.createServer(function(req,res){
	console.log(req.url);
	//parse url
	var parsed = url.parse(req.url);
	//get the url path name
	var pathName = parsed.pathname;
	console.log(pathName);
	//get the url query
	var query = parsed.query;
	console.log(query);
	//continue if query can be splitted
	if(query != null){
	//split the query string
	var querySplitted = query.split('&');
	console.log(querySplitted);
	//object to store the queries as a key-value pairs
	var store = {}
	for(index in querySplitted){
		var part = querySplitted[index];
		var subPart = part.split('=');
		store[subPart[0]] = subPart[1];
	}
	console.log(store);
	//make the object as json string	
	post = JSON.stringify(store);
	console.log(post);
	decide(req,res,pathName);
	}
	else{
	res.end(JSON.stringify({"error":"MALFORMED URL"}));
	}
	
	}).listen(8000);

//make decision based on the request method
function decide(req,res,pathName){
	switch(req.method){
	case 'GET':decidePath(pathName,res);
	break;
	default:res.end(JSON.stringify({"error":"METHOD NOT SUPPORTED"}));
	break;

	}

}

//make decision based on the request url
function decidePath(pathName,res){
	switch(pathName){
	case '/': initializeTransaction(res);
	break;
	default:res.end(JSON.stringify({"error":"PATH NOT SUPPORTED"}));
	break;



	}

}
//make request to Paystack to initialize transaction
function initializeTransaction(response){
	const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization':'Bearer sk_live_5e1de86d5451368286667cedbc7e87dc9e80651d'
  }
};

const req = https.request('https://api.paystack.co/transaction/initialize',options, (res) => {
  data = "";
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  //res.setEncoding('utf8');
  res.on('data', (chunk) => {
    data += chunk;
    console.log(`BODY: ${data}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
    response.end(data);
   
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(post);
req.end();



}




