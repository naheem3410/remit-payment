//initialize a transaction to paystack

var http = require('http');
var https = require('https');
var url = require('url');
const PORT = process.env.PORT || 5000
var post;
var verifyPath;
var data='';
var bankListPath;
var verifyAccountPath;
var chargeData='';
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
	//if pathName is /initialize, then queries are passed into json string
	//else if pathName is banklist, queries are not passed into json string but used like that
	if(pathName == "/initialize"){
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
	else if(pathName == "/bank"){//if pathName is /bank
		bankListPath = parsed.path
		console.log(bankListPath)
		console.log('SSSTTTTT '+verifyAccountPath);
		decide(req,res,pathName);
	}
	else if(pathName == "/bank/resolve"){//if pathName is /bank/resolve
		verifyAccountPath = parsed.path
		console.log(verifyAccountPath)
		console.log('INN OOORRR '+verifyAccountPath);
		decide(req,res,pathName);
	}
	else{
		res.end(JSON.stringify({"error":"PATH UNKNOWN"}));

	}
	}	
	else if(pathName == "/verify"){
		console.log("EnteredVerify");
		console.log(pathName);
		verifyPath = pathName;
		decide(req,res,pathName);

	}
	else if(pathName == "/charge"){
  		req.on('data', (chunk) => {
    		chargeData += chunk;
    		console.log(`BODY: ${data}`);
  		});
  		req.on('end', () => {
    		console.log('No more data in request.');
		console.log("CONSOLE ADD "+chargeData);
		decide(req,res,pathName);
    		//res.end(chargeData);
   
  		});

	}
	else{
	res.end(JSON.stringify({"error":"MALFORMED URL"}));
	}	
	}).listen(PORT);

//make decision based on the request method
function decide(req,res,pathName){
	switch(req.method){
	case 'GET':decidePath(pathName,res);
	break;
	case 'POST':decidePath(pathName,res);
	break;
	default:res.end(JSON.stringify({"error":"METHOD NOT SUPPORTED"}));
	break;

	}

}

//make decision based on the request url
function decidePath(pathName,res){
	switch(pathName){
	case '/initialize': initializeTransaction(res);
	break;
	case verifyPath: verifyTransaction(res,pathName);
	break;	
	case '/bank': listBank(res,pathName);
	break;
	case '/bank/resolve': verifyAccount(res,pathName);
	break;
	case '/charge': chargeBankAccount(res,pathName);
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
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb'
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

//make request to Paystack to verify a transaction
function verifyTransaction(response,pathName){
//options will be passed to the https instance
	const options = {
  method:"GET",
  headers: {
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb'
  }
};

const req = https.request('https://api.paystack.co/transaction'+pathName,options, (res) => {
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

req.end();



}
//make request to Paystack to get the list of banks that accept payment using bank account
function listBank(response,pathName){
//options will be passed to the https instance
	const options = {
  method:"GET",
  headers: {
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb'
  }
};

const req = https.request('https://api.paystack.co'+bankListPath,options, (res) => {
  data = "";
  console.log('https://api.paystack.co'+bankListPath);
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

req.end();



}

//make request to Paystack to verify the account number
function verifyAccount(response,pathName){
//options will be passed to the https instance
	const options = {
  method:"GET",
  headers: {
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb'
  }
};

const req = https.request('https://api.paystack.co'+verifyAccountPath,options, (res) => {
  data = "";
  
  console.log('https://api.paystack.co'+verifyAccountPath);
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

req.end();



}
//make request to Paystack to charge via bank account
function chargeBankAccount(response,pathName){

//options will be passed to the https instance
	const options = {
  method:"POST",
  headers: {
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb'
  }
};

const req = https.request('https://api.paystack.co/charge',options, (res) => {
  data = "";
  
  console.log('https://api.paystack.co/charge');
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
req.write(chargeData);
req.end();



}
