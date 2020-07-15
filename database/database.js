var mysql = require('mysql');

var db = mysql.createConnection({
host:'localhost',
user:'root',
database:'customers'

});

db.connect(function(err){
if(err){
console.log(err.code);
}
});

db.on('error',function(err){
console.log(err.code);
});
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
//create database table
exports.createTable = function(){
db.query(tableQuery,function(err){
if(err)throw err;
console.log('Server started...');
});
}

//insert data into the table
exports.insertCustomer=function(email,phone,paid,trial,res){
//insert if user is absent
db.query(tableInsert,[email,phone,paid,trial],function(err){
//if(err)throw err;
if(err){
console.log("Error inserting");
res.end(JSON.stringify({"status":false,"message":"Error insering"}));
}else{
console.log('Customer inserted...');
res.end(JSON.stringify({"status":true,"message":"Customer inserted"}));
}
});
}

//query to update customer
exports.updateCustomer=function(paid,trial,email,res){
db.query(tableUpdate,[paid,trial,email],function(err){
if(err){
console.log('Error updating...');
res.end(JSON.stringify({"status":false,"message":"Customer not updated"}));
}else{
console.log('Customer updated...');
res.end(JSON.stringify({"status":true,"message":"Customer updated"}));
}
});
}
//function to retrieve a user
exports.fetchCustomer = function(email,res){
db.query(tableSelect,[email],function(err,rows,fields){
if(err){
console.log('Customer not retrieved...');
res.end(JSON.stringify({"status":false,"message":"Customer not retrieved"}));
}else{
if(rows.length > 0){//if record is present
console.log('Customer retrievedaaa...'+rows.length);
console.log('Customer retrieved...'+rows);
res.end(JSON.stringify({"status":true,"paid":rows[0].paid,"trial":rows[0].trial,"message":"Customer retrieved"}));
}else{
res.end(JSON.stringify({"status":false,"message":"Customer not retrieved"}));
}
}
});
}

//query to delete the table
exports.deleteAllCustomers=function(res){
db.query(tableDeleteAll,function(err){
if(err){
console.log('Customers not deleted...');
res.end(JSON.stringify({"status":false,"message":"Customers not retrieved"}));
}else{
console.log('Customers deleted...');
res.end(JSON.stringify({"status":true,"message":"Customers deleted"}));
}
});
}