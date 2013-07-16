#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var rest = require('restler');
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var HTMLURL_DEFAULT = "http://radiant-mesa-9413.herokuapp.com";


var doNothing = function(inURL)
{
		return inURL.toString();
}

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var	htmlString = "";

var cheerioHtmlFile = function(htmlURL) {
		//console.log("OUTSIDE");
		//console.log(htmlString);
    return cheerio.load(htmlString);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlString, checksfile) {
    $ = cheerioHtmlFile(htmlString);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        //.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
				.option('-u, --url_link <URL_link>', 'The url address',clone(doNothing) , HTMLURL_DEFAULT )
        .parse(process.argv);
		//console.log(program.url_link);
		
		rest.get(program.url_link).on('complete', function(result, response) {
			if (result instanceof Error) {
				console.error('Error: ' + util.format(response.message));
			} else {
				//console.error("No error");
				htmlString = result.toString();
				var checkJson = checkHtmlFile(htmlString, program.checks);
				var outJson = JSON.stringify(checkJson, null, 4);
				console.log(outJson);
				//console.log("COMPLETED");
			}

		});
    
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
