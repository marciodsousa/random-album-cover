$(document).ready(() => {
    const albumData = {
        artist: null,
        title: null,
        cover: null
    };

    const promiseWikipedia = $.get("https://en.wikipedia.org/wiki/Special:Random")
        .done(function (payload) {
            console.log($(payload).find("h1.firstHeading").text());
            albumData.artist = $(payload).find("h1.firstHeading").text();
        });

    const promiseWikiquote = $.get("https://en.wikiquote.org/wiki/Special:Random")
        .done(function (payload) {
            const $parsedPayloadDom = $(payload);
            const $quotesDom = $parsedPayloadDom.find("#Quotes");
            const domElementIndexStart = $quotesDom.parent().index();
            const domElementIndexEnd = $quotesDom.parent().nextAll("h1,h2,h3,h4,h5,div").first().index();
            const eligibleQuotes = [];
            const numberWordsToKeep = getRandomInt(3, 5);

            $quotesDom.closest("div").children().each((index, element) => {
                if (index <= domElementIndexStart) return true;
                if (index >= domElementIndexEnd) return false;

                eligibleQuotes.push($(element).children()[0].childNodes[0].nodeValue);
            });

            let selectedQuote = eligibleQuotes[getRandomInt(0, eligibleQuotes.length)];
            selectedQuote = selectedQuote.slice(0, selectedQuote.length).split(" ").slice(-1 * numberWordsToKeep).join(" ");

            albumData.title = selectedQuote;
        });

    const promiseFlickr = $.get("https://www.flickr.com/explore/interesting/7days/?")
        .done(function (payload) {
            const $parsedPayloadDom = $(payload);
            const $photoDom = $($parsedPayloadDom.find(".Photo").get(5));
            const photoEndpoint = $photoDom.find("img").attr("src").replace("_m.", "_b.")
            albumData.cover = photoEndpoint;

            // https://www.flickr.com/photos/philipleets/49087742672/sizes/c/
        });

    Promise.all([promiseWikipedia, promiseWikiquote, promiseFlickr]).then(function (values) {
        console.log(albumData);
        $("body").append(`
        <p><h1>${albumData.artist}</h1></p>
        <p><h2>${albumData.title}</h2></p>
        <img src="${albumData.cover}"/>
        `)
    });
});


/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}