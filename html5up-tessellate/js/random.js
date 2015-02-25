// The random number generator

$(function() {

    // The generator button is placed first, hidden
    var $generator = $('li#generator');
    var $result = $generator.children();
    $generator.hide();
    // followed by choices
    var $choices = $('.random li:gt(0)');

    // the number range, 0 through "range"-1 inclusive
    var range;

    // user press button to set the number range
    function setRange(e) {
        // what's clicked, set the range accordingly
        var chosen = $(this).attr('id');
        switch (chosen) {
            case "binary":
                {
                    range = 2;
                    break;
                }
            case "base10":
                {
                    range = 10;
                    break;
                }
            default:
                break;
        }

        // then remove the choice buttons, show the generator
        $choices.remove();
        $generator.show();

        // prevent link from taking user elsewhere
        if (e.preventDefault) { // If preventDefault() works
            e.preventDefault(); // Use preventDefault() 
        } else { // Otherwise
            e.returnValue = false; // Use old IE version
        }
    }

    // generate next random number in specified range
    function generate() {
        var time = 500;
        // change the children of generator = the result-text itself
        $result.text(Math.floor((Math.random() * range)));
        $result.fadeTo(0, 0).fadeTo(time, 1);
    }

    // function runWeather() {
    //      runAll();
    // }

    // runWeather();
    $choices.on('click', setRange);
    $generator.on('click', generate);


});
