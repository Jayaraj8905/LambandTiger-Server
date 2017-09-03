const Game = module.exports;
const response = require('./../core/response');
const request = require('./../core/request');
const gameModel = require('./../models/game');

/**
 * [startGame description]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
Game.start = (req, res) => {
	const userId = request.getUserId(req);
	// get the available inactive game
	gameModel.list({status: 'inactive'}).then(data => {
		// if any inactive game exists
		// update that inactive game to active
		if(data[0]) {
			const gameId = data[0].id;
			// TODO: THE PLAYER1 SHOULD NOT BE THIS USER
			gameModel.update({
										id: gameId,
										player2id:userId,
										player2type: 'lamb',
										status: 'active'})
			.then((data) => {
				response.sendJson(req, res, {id: gameId, playertype: 'lamb'});
			})
		} else {
			// else create the game
			gameModel.insert({player1id: userId, player1type: 'tiger'})
			.then((data) => {
				response.sendJson(req, res, {id: data.insertId, playertype: 'tiger'});
			})
		}
	})
}

Game.end = (data) => {
	// get the game based on the id
	gameModel.update({id: data.id, status: 'end'});
}

Game.getGame = (data) => {
	return gameModel.list(data)
	.then(data => {
		return data[0]
	})
}

// get the list of games
Game.get = (req, res) => {
	const data = req.query;

	gameModel.list(data)
	.then(data => {
		response.sendJson(req, res, data);
	}).catch(data => {
		response.sendError(req, res, data);
	})
}

// insert the game
Game.post = (req, res) => {
	const data = req.body;

	if (data && Object.keys(data).length) {
		gameModel.insert(data)
		.then((data) => {
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

// update the game
Game.put = (req, res) => {
	const data = req.body;
	const id = data.id;

	if (data && Object.keys(data).length && id) {
		gameModel.update(data)
		.then(data => {
			response.sendJson(req, res, {id: id});
		})
		.catch(data => {
			response.sendError(req, res, data);
		})
	}
	else {
		response.sendJson(req, res);
	}
}
