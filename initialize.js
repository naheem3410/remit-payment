//initialize a transaction to paystack

var http = require('http');
var https = require('https');
var url = require('url');
const PORT = process.env.PORT || 5000
var post;
var verifyPath ='';
var pendingPath='';
var data='';
var bankListPath;
var jsonChargeData;
var verifyAccountPath;
var chargeData='';
var jsonOTP;
var jsonPin;
var jsonBirthday;
var jsonPhone;
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
		res.end(JSON.stringify({"status":false,"message":"PATH UNKNOWN"}));

	}
	}	
	else if(pathName.indexOf("/verify/") == 0){
		console.log("EnteredVerify");
		console.log(pathName);
		verifyPath = pathName;
		decide(req,res,pathName);

	}
	else if(pathName == "/charge"){
		chargeData = ''
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
	else if(pathName.indexOf("/charge/") == 0){
		console.log("EnteredPathVerify");
		console.log(pathName);
		//for OTP
		if(pathName == "/charge/submit_otp"){
		jsonOTP = '';
		
		console.log("OOTP"+pathName);
		req.on('data', (chunk) => {
    		jsonOTP += chunk;
    		console.log(`BODY: ${data}`);
  		});
  		req.on('end', () => {
    		console.log('No more data in request.');
		console.log("CONSOLE ADD "+jsonOTP);
		decide(req,res,pathName);
    		//res.end(chargeData);
   
  		});
		}
		//for Pin
		else if(pathName == "/charge/submit_pin"){
		jsonPin = '';
		
		console.log("PIN"+pathName);
		req.on('data', (chunk) => {
    		jsonPin += chunk;
    		console.log(`BODY: ${data}`);
  		});
  		req.on('end', () => {
    		console.log('No more data in request.');
		console.log("CONSOLE ADD "+jsonPin);
		decide(req,res,pathName);
    		//res.end(chargeData);
   
  		});
	}
		//for Birthday
	else if(pathName == "/charge/submit_birthday"){
		jsonBirthday = '';
		
		console.log("BIRTHDAY"+pathName);
		req.on('data', (chunk) => {
    		jsonBirthday += chunk;
    		console.log(`BODY: ${data}`);
  		});
  		req.on('end', () => {
    		console.log('No more data in request.');
		console.log("CONSOLE ADD "+jsonBirthday);
		decide(req,res,pathName);
    		//res.end(chargeData);
   
  		});
	}
		//for Phone
	else if(pathName == "/charge/submit_phone"){
		jsonPhone = '';
		
		console.log("PHONE"+pathName);
		req.on('data', (chunk) => {
    		jsonPhone += chunk;
    		console.log(`BODY: ${data}`);
  		});
  		req.on('end', () => {
    		console.log('No more data in request.');
		console.log("CONSOLE ADD "+jsonPhone);
		decide(req,res,pathName);
    		//res.end(chargeData);
   
  		});
	}
		//for checking Pending
		else{
		pendingPath = pathName;
		decide(req,res,pathName);
		}

	}
	else{
	res.end(JSON.stringify({"status":false,"message":"MALFORMED URL"}));
	}	
	}).listen(PORT);

//make decision based on the request method
function decide(req,res,pathName){
	switch(req.method){
	case 'GET':decidePath(pathName,res);
	break;
	case 'POST':decidePath(pathName,res);
	break;
	default:res.end(JSON.stringify({"status":false,"message":"METHOD UNSUPPORTED"}));
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
	case pendingPath: checkPending(res,pathName);
	break;
	case '/bank': listBank(res,pathName);
	break;
	case '/bank/resolve': verifyAccount(res,pathName);
	break;
	case '/charge': chargeBankAccount(res,pathName);
	break;
	case '/charge/submit_otp': submitOTP(res,pathName);
	break;
	case '/charge/submit_pin': submitPIN(res,pathName);
	break;
	case '/charge/submit_birthday': submitBirthday(res,pathName);
	break;
	case '/charge/submit_phone': submitPhone(res,pathName);
	break;
	default:res.end(JSON.stringify({"status":false,"message":"PATH UNSUPPORTED"}));
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
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb',
    'Content-Type': 'application/json'
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
//make request to Paystack to submit OTP
function submitOTP(response,pathName){

//options will be passed to the https instance
	const options = {
  method:"POST",
  headers: {
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb',
    'Content-Type':'application/json'
  }
};

const req = https.request('https://api.paystack.co/charge/submit_otp',options, (res) => {
  data = "";
  
  console.log('https://api.paystack.co/charge/submit_otp');
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
req.write(jsonOTP);
req.end();



}
//make request to Paystack to submit PIN
function submitPIN(response,pathName){

//options will be passed to the https instance
	const options = {
  method:"POST",
  headers: {
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb',
    'Content-Type':'application/json'
  }
};

const req = https.request('https://api.paystack.co/charge/submit_pin',options, (res) => {
  data = "";
  
  console.log('https://api.paystack.co/charge/submit_pin');
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
req.write(jsonPin);
req.end();



}
//make request to Paystack to submit birthday
function submitBirthday(response,pathName){

//options will be passed to the https instance
	const options = {
  method:"POST",
  headers: {
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb',
    'Content-Type':'application/json'
  }
};

const req = https.request('https://api.paystack.co/charge/submit_birthday',options, (res) => {
  data = "";
  
  console.log('https://api.paystack.co/charge/submit_birthday');
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
req.write(jsonBirthday);
req.end();



}
//make request to Paystack to submit phone
function submitPhone(response,pathName){
//options will be passed to the https instance
	const options = {
  method:"POST",
  headers: {
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb',
    'Content-Type':'application/json'
  }
};

const req = https.request('https://api.paystack.co/charge/submit_phone',options, (res) => {
  data = "";
  
  console.log('https://api.paystack.co/charge/submit_phone');
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
req.write(jsonPhone);
req.end();



}
//make request to Paystack to check pending
function checkPending(response,pathName){

//options will be passed to the https instance
	const options = {
  method:"GET",
  headers: {
    'Authorization':'Bearer sk_test_3c01e91aad9edc6566860fabb83deade6385fadb'
  }
};

const req = https.request('https://api.paystack.co'+pendingPath,options, (res) => {
  data = "";
  
  console.log('https://api.paystack.co'+pendingPath);
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

