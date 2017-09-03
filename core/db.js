const mysql = require('mysql');
const settings = require('./settings.js');

exports.get = (function(table) {
	let query = '';
	let where = '';

	this.and = (column, value) => {
		if (!where) {
			where += ' WHERE';
		} else {
			where += ' AND';
		}
		where += ' `'+column+'`="'+value+'"';
	}

	this.or = (column, value) => {
		if (!where) {
			where += ' WHERE';
		} else {
			where += ' OR';
		}
		where += ' `'+column+'`="'+value+'"';
	}

	this.execute = () => {
		query = 'SELECT * FROM `'+table+'`';
		if (where) {
			query += where;
		}
		return executeSql(query);
	}
})

exports.post = (function(table) {
	let query = '';
	let columns = '';
	let values = '';

	this.add = (column, value) => {
		if (columns) {
			columns += ', ';
			values += ', ';
		}
		columns += '`'+column+'`';
		values += '"'+value+'"';
	}

	this.execute = () => {
		if (columns && values) {
			const time = new Date().getTime();
			this.add('createdDate', time);
			this.add('modifiedDate', time);
			query =  'INSERT INTO `'+table+'` ('+columns+') VALUES ('+values+')';
		}
		return executeSql(query);
	}
})

exports.put = (function(table, id) {
	let query = '';
	let update = '';
	let values = '';

	this.add = (column, value) => {
		if (update) {
			update += ', ';
		}
		update += ' `'+column+'`="'+value+'"';
	}

	this.execute = () => {
		if (update && id) {
			const time = new Date().getTime();
			this.add('modifiedDate', time);
			query =  'UPDATE `'+table+'` SET '+update+' WHERE `id` = '+ id;
		}
		return executeSql(query);
	}
})

function executeSql(query) {
	if (query) {
		console.log('Executing Query '+ query);
		return new Promise(function(resolve, reject) {
			// connect to mysql
			const con = mysql.createConnection(settings.dbConfig);
			con.connect(function(err) {
				if (err) {
					console.log("Connection failed "+ query);
					throw err;
				} else {
					console.log("Connection successful "+ query);
					con.query(query, function (err, result, fields) {
						con.end();
						if (err) throw err;

						resolve(result);
					})
				}

			})
		})
	} else {
		return new Promise(function(resolve, rejecct) {
			resolve();
		})
	}


}
