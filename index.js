var http = require('http'); // Import Node.js core module
var querystring = require('querystring');
var express = require("express");
var cors = require("cors");
var app = express();
var FB = require("fb");

app.use(cors())



app.post("/api/facebook", function(req, res, next){
	processPost(req, res, function() {
			console.log(req.post);
			// Use request.post here

			res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
			res.end();
			startInformationFetch(req.post);
		});
});

app.get("/simulation", function(req, res, next){

	var info = {
		res: {
			authResponse: {
				accessToken: "EAAFZCK8b0poIBAFcV0zTCRRtmSTcUM5H4HeArk77XQiAzAF98FqqnTHWf4Rdofnt4RoyECdOSerB2ntNINuXTSrjWVmZBRJes03iJNlNjGLuCe3ZAKrmoHs2DK8BUEQdiTeZA4LUvYCTKevRyZAllIpXUAfYLxs1UVuTzrhhrw4Y4ZCk12rJmmF4kmahZBlI3j8Bf2wjSNsQwZDZD",
				userID: "10156979206582501"
			}
		}
	}

	startInformationFetch(info);
	res.end();
});

app.get("/", function(req, res, next){
	res.write("Tere");
	res.end();
})

var server = app.listen(5000);

//server.listen(5000); //6 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')

function startInformationFetch(info){

	var ar = info.res.authResponse;

	FB.setAccessToken(ar.accessToken);

	FB.api(ar.userID + "/tagged_places", function(res){
		if(!res || res.error) {
	    console.log(!res ? 'error occurred' : res.error);
	    return;
  	}

  	console.log(res);
	});
}

function processPost(request, response, callback) {
	var queryData = "";
	if(typeof callback !== 'function') return null;

	if(request.method == 'POST') {
		request.on('data', function(data) {
			queryData += data;
			if(queryData.length > 1e6) {
				queryData = "";
				response.writeHead(413, {'Content-Type': 'text/plain'}).end();
				request.connection.destroy();
			}
		});

		request.on('end', function() {
			request.post = querystring.parse(queryData);
			callback();
		});

	} else {
		response.writeHead(405, {'Content-Type': 'text/plain'});
		response.end();
	}
}
