/////////////
// working //
/////////////

// for array and set manipulation
var _ = require('underscore');
// web scraper
var sjs = require('scraperjs');
// for promise
var Q = require('q');
var async = require('async');
// file system for writer
var fs = require('fs');


// Crucial global var: lists of nodes and events
var nodelist, eventlist;


/////////////////////////////////////////////////
// rootScraper for the main calendar root page //
/////////////////////////////////////////////////
// Scraper for the node root – the main calendar page
var rootScraper = function() {
    // create a deferred promise for control (same as callback)
    var deferred = Q.defer();
    // construct a static scraper
    sjs.StaticScraper
        .create()
        .request({
            // main page to get all latest nodes
            url: 'https://calendar.lafayette.edu/',
            // jar to prevent memory leak of eventEmitter
            jar: true,
        })
        .onError(function(err) {
            console.log("Unable to scrape main calendar page: ", err);
        })
        // the scrape function, with $ jQuery selector
        .scrape(function($) {
            // The css selector: event titles, containing nodes in links
            return $('h3.event-title-wrapper a').map(function() {
                // get the node subpath
                return $(this).attr('href');
            }).get();
            // result returned
        }, function(res) {
            // take the first 60 nodes, for reasonable speed and coverage
            res = res.slice(0, 60);
            console.log(res);
            // all results, saved into array in JSON
            fs.writeFile('./data/nodelist.json', JSON.stringify(res, null, 4), function(err) {
                // reject or resolve the promise: flow control
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                    console.log("File written to nodelist.json");
                }
            });

        });

    // finally after all has run, allow next promise to run
    return deferred.promise;
}



/////////////////////////////////////
// nodeScraper for each event node //
/////////////////////////////////////

// Helper method to parse an event object from the event page
var extract = function($) {
    // console.log("extracting");
    return {
        title: $('div#content-main h2').text(),
        tag: $('.field-name-field-tags div.field-item.even').text(),
        time: $('.field-name-field-date div.field-item.even').text(),
        location: $('.field-name-field-location div.field-item.even').text(),
        price: $('.field-name-field-price div.field-item.even').text(),
        sponsor: $('.field-name-field-sponsor div.field-item.even').text(),
        contact: $('.field-name-field-event-web-site div.field-item.even').text()
    }
}

// Helper method to push a parsed event object to eventlist
// Control: when done parsing: eventlist = nodelist length, stop and write
var appendEvent = function(parsed) {
    console.log("adding:");
    eventlist.push(parsed);

    //////////////////////////////////////////////////////////////////////////////
    // temporary solution to not being able to end async before writing to json //
    //////////////////////////////////////////////////////////////////////////////
    if (eventlist.length === nodelist.length) {
        // replace the file content with newly parsed eventlist
        fs.writeFile('./data/parsed-events.json', JSON.stringify(eventlist, null, 4), function(err) {
            if (err) throw err;
            console.log("File written to parsed-events.json");
        })
    };
}



// scrape a node, specified by the subpath found in the nodelist array
var nodeScraper = function(subpath) {
    // construct a static scraper
    sjs.StaticScraper
        .create()
        .request({
            // url of the event node page: concat subpath
            url: 'https://calendar.lafayette.edu' + subpath,
            // jar to prevent memory leak of eventEmitter
            jar: true,
        })
        .onError(function(err) {
            console.log("Fail to scrape event: ", err);
        })
        // the scrape function, with $ jQuery selector passed
        .scrape(
            // call the extract function to return event object
            extract,
            // then function append it to all parsed events
            appendEvent
        )
}

// Scrape and parse all events from the nodelist
var parseAll = function() {
    // reset the lists
    eventlist = [];
    nodelist = require('./data/nodelist.json');
    // run nodeScraper for each node in list, save to eventlist, then write file
    async.each(nodelist, nodeScraper, function(err) {
        if (err) return err;
    });
}

////////////////////
// Test functions //
////////////////////

var first = function() {
    console.log("if it's called first");
}
var last = function() {
    console.log("if it's last");
}



///////////////////
// Functions run //
///////////////////
// Use Q promise chaining: scrape root first, export to nodelist, then import it, scrape and parseAll nodes as events, write to file
Q.fcall(first).then(rootScraper).then(last).then(parseAll);





