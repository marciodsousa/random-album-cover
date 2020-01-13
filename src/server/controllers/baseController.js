const uuid = require('uuid');
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

exports.getFullInfo = async (req, res) => {
    await getAllInfo();
    
}

exports.getWikipediaName = async (req, res) => {
    const response = await axios.get('https://en.wikipedia.org/wiki/Special:Random')
 
    const dom = new JSDOM(response.data);
    const chosenArtistName = dom.window.document.querySelector("h1.firstHeading").textContent
    return chosenArtistName;
}


exports.getWikiquoteTitle = async (req, res) => {
    const response = await axios.get('https://en.wikiquote.org/wiki/Special:Random')

    const dom = new JSDOM(response.data);
    const eligibleQuotes = [];
    
    dom.window.document.querySelectorAll('#bodyContent li:not([class]), #bodyContent dd:not([class])').forEach(element => {
        if (!element.closest(".mw-parser-output") || element.closest("li")) return true;
        element.querySelectorAll("li,dd").forEach(elementToRemove=> elementToRemove.remove());

        eligibleQuotes.push(element.textContent);
    });

    const numberWordsToKeep = getRandomInt(3, 5);
    let selectedQuote = eligibleQuotes[getRandomInt(0, eligibleQuotes.length)];

    selectedQuote = selectedQuote.slice(0, selectedQuote.length).split(" ").slice(-1 * numberWordsToKeep).join(" "); 
    return selectedQuote;

}

exports.getFlickrPhoto = async(req, res) => {
    const response = await axios.get('https://www.flickr.com/explore/interesting/7days/?')

    const dom = new JSDOM(response.data);
    const photoDom = dom.window.document.querySelectorAll(".Photo")[5]; //get the 5th one
    const photoEndpoint = photoDom.querySelector("img").getAttribute("src").replace("_m.", "_b.")
    

    return photoEndpoint;
}

exports.getAllInfo =  async (req, res) => {

    const bandName = await exports.getWikipediaName()
    .catch(error => {
        throw error;
    });
    const albumTitle = await exports.getWikiquoteTitle()
    .catch(error => {
        throw error;
    });
    const albumCoVer = await exports.getFlickrPhoto()
    .catch(error => {
        throw error;
    });

    res.json({name: bandName, title: albumTitle, coverURL: albumCoVer});
}

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