const hostname = '192.168.1.80';
const port = 3000;

const nodemailer = require("nodemailer");

const app = require('express')();
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', (req, res) => {
	res.send('Please Use /api Endpoints!');
})

app.post('/api/sendmail', (req, res) => {
	console.log(req.body);
	const from = req.body['email'];
	const name = req.body['name'];
	const subject = `PORTFOLIO MAIL: ${req.body['subject']}`;
	const message = req.body['message'];
	const text = `MailId: ${from}
Name: ${name}
Message: ${message}`;
	sendMail(from, name, subject, text);
	res.send('success');
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

app.listen(port, hostname, () => {
	console.log('Server started on port '+ port);
})

function getClientBySocket(ws) {
		return socketClients.find((socket) => socket.ws === ws);
}

function getClientByIds(userId, gameId) {
		return socketClients.find((socket) => socket.gameId == gameId && socket.userId == userId);
}



// async..await is not allowed in global scope, must use a wrapper
async function sendMail(from, name, subject, text) {

	// https://stackoverflow.com/questions/26948516/nodemailer-invalid-login
	// https://myaccount.google.com/lesssecureapps
	// https://accounts.google.com/DisplayUnlockCaptcha
	// https://community.nodemailer.com/using-gmail/
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		  user: 'jayaraj8905@gmail.com',
		  pass: 'password'
		}
	});

	var mailOptions = {
		from,
		to: 'jayaraj8905@gmail.com',
		subject,
		text
	};

	let info = await transporter.sendMail(mailOptions);

	console.log("Message sent: %s", info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
	// Preview only available when sending through an Ethereal account
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
//   sendMail().catch(console.error);
