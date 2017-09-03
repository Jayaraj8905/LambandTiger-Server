const UserModel = module.exports;
const db = require('./../core/db');
const response = require('./../core/response');

const table = 'user';
UserModel.fields = {
	id: 'id',
	name: 'name',
	createdDate: 'createdDate',
	modifiedDate: 'modifiedDate'
}


// get the list of users
UserModel.list = (data) => {
	const get = new db.get(table);
	if (data && data.id) {
		get.and(UserModel.fields.id, data.id);
	}

	return get.execute();
}

// insert the user
UserModel.insert = (data) => {
	const post = new db.post(table);
	if (data && Object.keys(data).length && data.name) {
		post.add(UserModel.fields.name, data.name);

		return post.execute();
	}
}
