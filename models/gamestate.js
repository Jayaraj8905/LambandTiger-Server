const GameStateModel = module.exports;
const db = require('./../core/db');
const response = require('./../core/response');

const table = 'gamestate';
GameStateModel.fields = {
	id: 'id',
	gameid: 'gameid',
	playerid: 'playerid',
	position: 'position',
	number: 'number',
	createdDate: 'createdDate',
	modifiedDate: 'modifiedDate'
}


// get the list of users
GameStateModel.list = (data) => {
	const get = new db.get(table);
	if (data && data.id) {
		if (data.id) {
			get.and(GameStateModel.fields.id, data.id);
		}

		if (data.gameid) {
			get.and(GameStateModel.fields.gameid, data.gameid);
		}

		if (data.playerid) {
			get.and(GameStateModel.fields.playerid, data.playerid);
		}
	}

	return get.execute();
}

// insert the user
GameStateModel.insert = (data) => {
	const post = new db.post(table);
	if (data && Object.keys(data).length) {
		if (data.gameid) {
			post.add(GameStateModel.fields.gameid, data.gameid);
		}

		if (data.playerid) {
			post.add(GameStateModel.fields.playerid, data.playerid);
		}

		if (data.position) {
			post.add(GameStateModel.fields.position, data.position);
		}

		if (data.number) {
			post.add(GameStateModel.fields.number, data.number);
		}

		return post.execute();
	}
}
