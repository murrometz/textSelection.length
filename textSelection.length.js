// ==UserScript==
// @name textSelection.length
// @namespace tslc_225258
// @version 0.02
// @require http://code.jquery.com/jquery-latest.js
// @source https://userscripts-mirror.org/scripts/source/147224.user.js
// @description textSelection.length
// @include https://userscripts-mirror.org/scripts/*/147224*
// ==/UserScript==

(function ($) {

    /**
     * Setting up
     */

    $ = $.noConflict();

    id = 'tslc_counter_225258';//(new Date()).getTime()

    counter = $('#' + id);

    //counter.remove();

    /**
     * Service functions
     */

    function getSelectedText() {
        var el = document.activeElement;
        var text = "";

        //if selection is in input or textarea, or something similar
        if (typeof el.selectionStart == "number")
        {
            text = el.value.slice(el.selectionStart, el.selectionEnd);
        }
        //else if selection is in plain document
        else
        {
            if (typeof window.getSelection != "undefined") { // if we have method getSelection, use it
                text = window.getSelection().toString();
            } else { // for IE
                text = document.selection.createRange().text;
            }
        }

        return text;
    }

    function getWords(str)
    {
        //parameter check
        if (typeof str != "string" || !str.length)
            return [];

        //added Russian, Belarussian, Ukranian and English support
        //words with "-" should have mote than 1 symbol ("-" is not a word)
        var words = str.match(/([\wа-яА-ЯҐЄІЇЎґєіїў-]{2,}|[\wа-яА-ЯҐЄІЇЎґєіїў]{1,})/ig);
        if (words !== null)
            return words;
        else
            return [];
    }

    function removeCounter()
    {
        counter.remove();
    }

    /**
     * Main function
     */

    var key = function (e) {

        var Length = 0, WordCount = 0;

        //if (!e.ctrlKey) return
        if (!counter.length) {
            $('body').append('<div style=\'position:absolute; display:none; box-shadow: 0 0 17px #999; min-height:62px; width: auto; line-height:29px; text-align:left; padding: 2px 10px 0; opacity:1; z-index:1200000000000; color:black; background:#f9f9f9; -background:rgba(255,255,255,0.95); background-opacity:0.5; \' id=\'' + id + '\'></div>');
        }

        counter = $('#' + id);

        //getting selected Text
        var text = getSelectedText();

        //getting Length
        Length = text.length;

        //getting Words from selected text
        var words = getWords(text);

        //getting Word Count
        WordCount = words.length;

        if (Length) {
            counter.html("Words:&nbsp;" + WordCount + "<br/>Symbols:&nbsp;" + (0 + Length));
            counter.show();
        } else {
            counter.hide();
            counter.remove();
        }
    };

    /**
     * Event handlers
     */
    $('form').submit(removeCounter);
    //FIX: This causes blinking
    $(window).blur(removeCounter);
    $('body').mouseleave(removeCounter); //Blinks
    $('body').keydown(key).keyup(key).click(key).dblclick(function () {
        setTimeout(key, 10)
    });
    //.mousedown(function(){setTimeout(key,10)}).;

    $('body').mousemove(function (e) {
        key(e);

        if (counter.text())
        {
            var left = (e.pageX + 12 + counter.width()) < $(window).width() ? e.pageX + 12 : e.pageX - counter.width();
            var _top = (e.pageY - 75) < 0 ? e.pageY + 30 : e.pageY - 75;
            counter.css({'left': left, 'top': _top});
        }
    });
})(jQuery);