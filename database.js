
const mysql = require('mysql');

const connection = mysql.createConnection({
	host : 'localhost',
	database : 'data_base',
	table:'profile',
	user : 'root',
	password : 'Adroitwriter68!'
});

connection.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('MySQL Database is connected Successfully');
	}
});

module.exports = connection;