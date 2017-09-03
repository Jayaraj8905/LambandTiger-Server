const GameState = module.exports;
const response = require('./../core/response');
const gameStateModel = require('./../models/gamestate');

GameState.add = (data) => {
		if (data && Object.keys(data).length) {
			return gameStateModel.insert(data)
			.then(data => {
				return {id: data.insertId};
			})
			.catch(data => {
				
			})
		}
}

// get the list of games
GameState.get = (req, res) => {
	const data = req.query;

	gameStateModel.list(data)
	.then(data => {
		response.sendJson(req, res, data);
	})
	.catch(data => {
		response.sendError(req, res, data);
	})
}

// insert the gamestate
GameState.post = (req, res) => {
	const data = req.body;

	if (data && Object.keys(data).length) {
		gameStateModel.insert(data)
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
