const Twit = require("twit");

let client;
let userId;

function createClientInstance(api_key, api_secret, access_token, access_secret) {
	client = new Twit({
		consumer_key: api_key,
		consumer_secret: api_secret,
		access_token: access_token,
		access_token_secret: access_secret,
	});
}

// Authenticate the user credentials
exports.authenticateSignIn = (tokens) => {
	try {
		console.log("Creating client instance...");
		createClientInstance(
			tokens.api_key,
			tokens.api_secret,
			tokens.access_token,
			tokens.access_secret
		);
	} catch (err) {
		console.log("Error creating client instance");
		console.log(err);
	}

	const authenticate = () => {
		return new Promise((resolve, reject) =>
			client.get("account/verify_credentials", (err, data, response) => {
				if (err) reject(err);
				else {
					userId = data.id_str;
					resolve(data);
					console.log("Authentication successful.");
				}
			})
		);
	};

	return authenticate(); // Pass the promise up to the calling function of authenticateLogin.
};

// Used to get the users list of followers
exports.getFollowerList = () => {
	return new Promise((resolve, reject) =>
		client.get(
			"followers/list",
			{
				screen_name: userId,
				count: 200,
			},
			(err, data, response) => {
				if (err) reject(err);
				resolve(data);
			}
		)
	);
};

exports.messageFollowers = async () => {
	try {
		await client.post("direct_messages/events/new", {
			event: {
				type: "message_create",
				message_create: {
					target: {
						recipient_id: "4903048552",
					},
					message_data: {
						text: "I AM ALIVE!",
					},
				},
			},
		});
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};
