var colors = require('colors/safe');
var fs = require('fs');
var readline = require('readline');
var CryptoJS = require("crypto-js");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var ticker = 0;
var user = {};
var users;
var usersFile;

if (fs.existsSync('users.json')) {
    try {
    var usersFile = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(usersFile);
    console.info(colors.green('Found users.json file'));
    console.info(colors.green('Contains '+ users.length + ' users'));
  } catch (e) {
    console.error(colors.red('users.json is not a valid json'));
  }
} else {
	var fd = fs.openSync('users.json', 'w');
	console.info(colors.green('users.json file created'));
	users = [];
}


console.log(colors.yellow.underline('Create a user:'));
console.log(colors.yellow('Enter the username:'));

// found on http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}


rl.on('line', function(line){
	switch (ticker) {
		case 0:
			user.username = line;
			console.log(colors.yellow('Enter the password:'));
			
			break;
		case 1:
			user.password = CryptoJS.SHA256(line).toString(CryptoJS.enc.Hex);
			user.id = generateUUID();
			users.push(user);
			fs.writeFile("users.json", JSON.stringify(users), function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    console.log("The file was saved!");
			}); 
			rl.close();
		break;
	}
	ticker++;
});

