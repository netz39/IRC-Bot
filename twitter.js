var https = require('https'),
	util = require('util'),
	url = require('url');
var irc = require('irc');
var config = require('./config.js');

var trackstring = "track=netz39&follow=86615241";
var debug = false;

var options = {
	host : 'stream.twitter.com',
	port : 443,
	path : '/1/statuses/filter.json',
	auth : config.twitter.username + ":" + config.twitter.password,
	headers : {
		'Content-Type' : 'application/x-www-form-urlencoded'
	},
	method : 'POST',
}
if(!debug) {
	var bot = new irc.Client('irc.freenode.net', 'netz39twitter', {
		channels: ['#netz39']
	});

	bot.on('error', function(err) {
		util.puts(JSON.stringify(err));
	});

	bot.join("#netz39");
}

var req = https.request(options, function(res) {

	util.puts("Opening Stream with StatusCode: ", res.statusCode);
	util.puts(JSON.stringify(res.headers));
	res.on('data', function(dat) {
		
		try{
			if(/^\{/.test(dat)) {
				var tweet = JSON.parse(dat);
				if(tweet.user) {
					if(!debug) {
						bot.say( "#netz39", '\u0002' + irc.colors.wrap( 'dark_green', tweet.user.screen_name + ': ', 'reset' ) + tweet.text );
						//util.puts(tweet.user.screen_name + tweet.text);
					}
					else {
						util.puts(tweet.user.screen_name + ': ' +tweet.text);
					}
				}
			}
		} catch (err) {
			util.puts('Catch me if u can');
			util.puts(dat);
		}
	});

});

req.write(trackstring);
req.end();

req.on('error', function(e) {
	util.puts(e);
});

