const hostname = '52.77.225.255';
const port = 3000;

const app = require('express')();
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send('Please Use /api Endpoints!');
})


// User Api's
const user = require('./api/user');
app.get('/api/user/list', (req, res) => {
	user.get(req, res);
})

app.post('/api/user/create', (req, res, reqBody) => {
	user.post(req, res);
})

// Game Api's
const game = require('./api/game')

app.get('/api/game/start', (req, res) => {
	game.start(req, res);
})

app.get('/api/game/list', (req, res) => {
	game.get(req, res);
})

app.post('/api/game/insert', (req, res) => {
	game.post(req, res);
})

app.post('/api/game/update', (req, res) => {
	game.put(req, res);
})

// Game State Api's
const gamestate = require('./api/gamestate')
app.get('/api/gamestate/list', (req, res) => {
	gamestate.get(req, res);
})

app.post('/api/gamestate/insert', (req, res) => {
	gamestate.post(req, res);
})





// Websocket Connection

const socketClients = [];
const expressWs = require('express-ws')(app);
app.ws('/message', function(ws, req) {

	console.log('Connection created');
	socketClients.push({
		userId: req.query.userId,
		gameId: req.query.gameId,
		ws: ws
	})

	ws.on('message', function(msg) {
    	console.log('Message from Client is', msg);
			const client = getClientBySocket(ws);

			const changeData = JSON.parse(msg);
			// add the entry in the game state
			gamestate.add({
					playerid: client.userId,
					gameid: client.gameId,
					position: changeData.position,
					number: changeData.number
			}).then(data => {
					// get the opposition id to find the socket
					game.getGame({
							id: client.gameId
					}).then(gameData => {
							if (gameData) {
									const oppositionId = gameData.player1id == client.userId ? gameData.player2id : gameData.player1id;
									if (oppositionId) {
											changeData['type'] = gameData.player1id == client.userId ? gameData.player1type : gameData.player2type;
											const oppositionClient = getClientByIds(oppositionId, client.gameId);
											if (oppositionClient) {
													oppositionClient.ws.send(JSON.stringify(changeData));
											}
									}
							}
							const oppositionId = client.userId
					})
			})
  });

  ws.on('close', function(msg) {
  	console.log('Socket Closed');
		const client = getClientBySocket(ws);
		const index = socketClients.indexOf(client);
		if (index !== -1) {
			// update the game to end state
			game.end({id: client.gameId});
			socketClients.splice(index, 1);
		}
  })
});

app.listen(port, () => {
	console.log('Server started on port '+ port);
})

function getClientBySocket(ws) {
		return socketClients.find((socket) => socket.ws === ws);
}

function getClientByIds(userId, gameId) {
		return socketClients.find((socket) => socket.gameId == gameId && socket.userId == userId);
}
