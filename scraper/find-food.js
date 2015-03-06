// For array manipulation
var _ = require('underscore');
var fs = require('fs');

// Import array of parsed event objects
var parsed = require('./data/parsed-events.json');
// console.log(parsed.length);

// Define the keywords to look for food
var keywords = ['pizza', 'pizzas', 'piza', 'lunch', 'food', 'sandwiches'];

// test
keywords.push('pre');
// _.each(parsed, function(e) {
//     console.log(e.price);
// })

/////////////
// Filters //
/////////////

// first filter: kill off all price = 'free' only
var keep = function(ev) {
    return !(ev.price.toLowerCase() === 'free');
}

// regex for all symbols and white space, newline
var re = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ \n]/

// second filter: search for those with keyword
var hasFood = function(ev) {
    // split the words in price by regex
    var words = ev.price.toLowerCase().split(re);
    // if intersection with keywords nonempty, then got food
    var match = _.intersection(keywords, words);
    return !(match.length == 0);
}

//////////////////
// Run function //
//////////////////

// Run the filter and write food events to food.json
var findFood = function() {
    // two filters
    var fil1 = _.filter(parsed, keep);
    var food = _.filter(fil1, hasFood);

    // write events with free food to output
    fs.writeFile('./data/food.json', JSON.stringify(food, null, 4), function(err) {
        if (err) throw err;
        console.log("File written to food.json");
    });
};



// Main function call
findFood();


