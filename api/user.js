const User = module.exports;
const response = require('./../core/response');
const userModel = require('./../models/user');

// get the list of users
User.get = (req, res) => {
	const data = req.query;

	userModel.list(data)
	.then(data => {
		response.sendJson(req, res, data);
	})
	.catch(data => {
		response.sendError(req, res, data);
	})
}

// insert the user
User.post = (req, res) => {
	const data = req.body;

	if (data && Object.keys(data).length && data.name) {
		userModel.insert(data)
		.then(data => {
			response.sendJson(req, res, {id: data.insertId});
		})
		.catch(data => {
			response.sendError(req, res, data);
		})
	} 
	else {
		response.sendJson(req, res);
	}
}
