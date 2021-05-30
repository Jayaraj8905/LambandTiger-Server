const GameModel = module.exports;
const db = require('./../core/db');
const response = require('./../core/response');

const table = 'game';
GameModel.fields = {
	id: 'id',
	player1id: 'player1id',
	player2id: 'player2id',
	player1type: 'player1type',
	player2type: 'player2type',
	status: 'status',
	createdDate: 'createdDate',
	modifiedDate: 'modifiedDate'
}


// get the list of users
GameModel.list = (data) => {
	const get = new db.get(table);
	if (data) {
		if (data.id) {
				get.and(GameModel.fields.id, data.id);
		}

		if (data.status) {
			get.and(GameModel.fields.status, data.status);
		}

	}

	return get.execute();
}

// insert the user
GameModel.insert = (data) => {
	const post = new db.post(table);
	if (data && Object.keys(data).length) {
		if (data.player1id) {
			post.add(GameModel.fields.player1id, data.player1id);
		}

		if (data.player2id) {
			post.add(GameModel.fields.player2id, data.player2id);
		}

		if (data.player1type) {
			post.add(GameModel.fields.player1type, data.player1type);
		}

		if (data.player2type) {
			post.add(GameModel.fields.player2type, data.player2type);
		}

		return post.execute();
	}
}

GameModel.update = (data) => {
	const id = data.id;

	if (data && Object.keys(data).length && id) {
		const put = new db.put(table, id);
		if (data.player1id) {
			put.add(GameModel.fields.player1id, data.player1id);
		}

		if (data.player2id) {
			put.add(GameModel.fields.player2id, data.player2id);
		}

		if (data.player1type) {
			put.add(GameModel.fields.player1type, data.player1type);
		}

		if (data.player2type) {
			put.add(GameModel.fields.player2type, data.player2type);
		}

		if (data.status) {
			put.add(GameModel.fields.status, data.status);
		}

		return put.execute();
	}
}
