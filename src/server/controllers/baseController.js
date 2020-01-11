// const mongoose = require('mongoose');
// const Park = mongoose.model('Park');
const uuid = require('uuid');
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

exports.getFullInfo = async (req, res) => {
    await getAllInfo();
    
}

exports.getWikipediaName = async (req, res) => {
    await axios.get('https://en.wikipedia.org/wiki/Special:Random')
        .then(payload => {
            const dom = new JSDOM(payload.data);
            // console.log(dom.window.document.querySelector("h1.firstHeading").textContent);
            const chosenArtistName = dom.window.document.querySelector("h1.firstHeading").textContent
            res.json({ title: chosenArtistName });
            // res.render('index');
        })
        .catch(error => {
            throw error;
        });
}


exports.getWikiquoteTitle = (req, res) => {
    axios.get('https://en.wikiquote.org/wiki/Special:Random')
        .then(payload => {
            const dom = new JSDOM(payload.data);

            const eligibleQuotes = [];
            dom.window.document.querySelector('#bodyContent li:not([class]):not(li li), #bodyContent dd:not([class])').each((index, element) => {
                const $element = $(element);
                if (!$(element).closest(".mw-parser-output").length) return true;
                $element.find("li,dd").remove();

                eligibleQuotes.push($element.text());
            });




            // const $quotesDom = $parsedPayloadDom.find("#Quotes");
            // const domElementIndexStart = $quotesDom.parent().index();
            // const domElementIndexEnd = $quotesDom.parent().nextAll("h1,h2,h3,h4,h5,div").first().index();
            // const eligibleQuotes = [];
            const numberWordsToKeep = getRandomInt(3, 5);

            // $quotesDom.closest("div").children().each((index, element) => {
            //     if (index <= domElementIndexStart) return true;
            //     if (index >= domElementIndexEnd) return false;

            //     eligibleQuotes.push($(element).children()[0].childNodes[0].nodeValue);
            // });

            let selectedQuote = eligibleQuotes[getRandomInt(0, eligibleQuotes.length)];
            selectedQuote = selectedQuote.slice(0, selectedQuote.length).split(" ").slice(-1 * numberWordsToKeep).join(" ");

            albumData.title = selectedQuote;
        })
        .catch(error => {
            console.log(error);
        });
}

exports.getFlickrPhoto = (req, res) => {
    axios.get('https://www.flickr.com/explore/interesting/7days/?')
        .then(payload => {
            const dom = new JSDOM(payload.data);
            const photoDom = dom.window.document.querySelector(".Photo") //get the 5th one
            const photoEndpoint = photoDom.find("img").attr("src").replace("_m.", "_b.")
            albumData.cover = photoEndpoint;
        })
        .catch(error => {
            console.log(error);
        });
}