var mysql = require('mysql');

var pool = mysql.createPool({
host:'us-cdbr-east-02.cleardb.com',
user:'b9e76c0f296224',
password:'78abf7fc',
database:'heroku_3555ff1f7e3a879'

});

/*console.log('DB_URL ',process.env.DATABASE_URL);
//function connect with database
exports.connectDatabase = function(){
db.connect(function(err){
if(err){
console.log(err.code);
//res.end(JSON.stringify({"status":false,"message":"Cannot connect to database"}));
}
});
}*/

/*//function watch for any errors concerning the use of the database
//exports.watchDatabaseErrors = function(){
pool.on('error',function(err){
console.log(err.code);
//res.end(JSON.stringify({"status":false,"message":"Error in database operation"}));
});

//}*/

//retrieve a user
var tableSelect = "SELECT * FROM customers WHERE email = ?";
//query for customer data insertion
var tableInsert = "INSERT INTO customers (email,phone,paid,trial) VALUES (?,?,?,?)";
//query to update customer
var tableUpdate = "UPDATE customers SET paid = ?, trial = ? WHERE email = ?"
//query to delete everything
tableDeleteAll = "DELETE FROM customers";
//query for table creation
var tableQuery = "CREATE TABLE IF NOT EXISTS customers (email VARCHAR(30) NOT NULL,phone VARCHAR(15) NOT NULL,paid INT NOT NULL,trial INT NOT NULL,PRIMARY KEY (email))";
//function create database table
exports.createDatabaseTable = function(){
pool.getConnection(function(err,connection){
if(err){
  console.log(err);
  return;
}
connection.query(tableQuery,function(error){
if(error){
console.log(error.code);
//res.end(JSON.stringify({"status":false,"message":"Cannot create database table"}));
return;
}
console.log('Table created...');
//release connection
  connection.release();
 if(error){
  console.log(error);
  return;
}
});
});
}

//insert data into the table
exports.insertCustomer=function(email,phone,paid,trial,res){
 //get a connection from the pool
	pool.getConnection(function(err,connection){
if(err){
  console.log(err);
  return;
}
    //insert if user is absent
connection.query(tableInsert,[email,phone,paid,trial],function(error){
//if(err)throw err;
if(error){
console.log("Error inserting");
res.end(JSON.stringify({"status":false,"message":"Error insering"}));
return;
}
console.log('Customer inserted...');
res.end(JSON.stringify({"status":true,"message":"Customer inserted"}));
/release the connection
  connection.release();
 if(error){
  console.log(error);
  return;
}
});
});
}

//query to update customer
exports.updateCustomer=function(paid,trial,email,res){
  //gets a connection from the pool
	pool.getConnection(function(err,connection){
if(err){
  console.log(err);
  return;
}
connection.query(tableUpdate,[paid,trial,email],function(error){
if(error){
console.log('Error updating...');
res.end(JSON.stringify({"status":false,"message":"Customer not updated"}));
return;
}
console.log('Customer updated...');
res.end(JSON.stringify({"status":true,"message":"Customer updated"}));
//release the connection
  connection.release();
 if(error){
  console.log(error);
  return;
}
});
});
}
//function to retrieve a user
exports.fetchCustomer = function(email,res){
//gets a connection
pool.getConnection(function(err,connection){
if(err){
  console.log(err);
  return;
}
connection.query(tableSelect,[email],function(error,rows,fields){
if(error){
console.log('Customer not retrieved...');
res.end(JSON.stringify({"status":false,"message":"Customer not retrieved"}));
return;
}
if(rows.length > 0){//if record is present
console.log('Customer retrievedaaa...'+rows.length);
console.log('Customer retrieved...'+rows);
res.end(JSON.stringify({"status":true,"paid":rows[0].paid,"trial":rows[0].trial,"message":"Customer retrieved"}));
}else{
res.end(JSON.stringify({"status":false,"message":"Customer not retrieved"}));
}
//release the connection
  connection.release();
 if(error){
  console.log(error);
  return;
}
});
});
}

//query to delete the table
exports.deleteAllCustomers=function(res){
//get a connection from the pool
pool.getConnection(function(err,connection){
if(err){
  console.log(err);
  return;
}
connection.query(tableDeleteAll,function(error){
if(error){
console.log('Customers not deleted...');
res.end(JSON.stringify({"status":false,"message":"Customers not retrieved"}));
return;
}
console.log('Customers deleted...');
res.end(JSON.stringify({"status":true,"message":"Customers deleted"}));
//release the connection
  connection.release();
 if(error){
  console.log(error);
  return;
}
});
});
}
