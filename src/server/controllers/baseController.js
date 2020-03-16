const uuid = require('uuid');
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const textMutations = {
    case: ["upper", "lower", "camel"],
    font: ["edgy", "edgy", "edgy", "edgy", "edgy"],
    style: ["bold", "underline", "normal", "strikethrough"],
    ending: ["none", "fullstop", "exclamation", "question", "ellipsis"]
}

const albumStyles = [{
    title: { font: "edgy", style: "normal", ending: "question", case: "lower" },
    artist: { font: "lucky", style: "strikethrough", ending: "question", case: "lower" },
}, {
    title: { font: "edgy", style: "normal", ending: "question", case: "lower" },
    artist: { font: "classic", style: "overline", ending: "question", case: "lower" },
}, {
    title: { font: "lucky", style: "normal", ending: "question", case: "lower" },
    artist: { font: "cursive", style: "normal", ending: "question", case: "lower" },
}, {
    title: { font: "classic", style: "normal", ending: "question", case: "capitalize" },
    artist: { font: "lucky", style: "normal", ending: "question", case: "upper" },
}, {
    title: { font: "edgy", style: "italic", ending: "question", case: "camel" },
    artist: { font: "cursive", style: "normal", ending: "question", case: "lower" },
}];

exports.getFullInfo = async(req, res) => {
    await getAllInfo();

}

exports.getWikipediaName = async(req, res) => {
    const response = await axios.get('https://en.wikipedia.org/wiki/Special:Random')

    const dom = new JSDOM(response.data);
    const chosenArtistName = dom.window.document.querySelector("h1.firstHeading").textContent
    return chosenArtistName;
}


exports.getWikiquoteTitle = async(req, res) => {
    const response = await axios.get('https://en.wikiquote.org/wiki/Special:Random')

    const dom = new JSDOM(response.data);
    const eligibleQuotes = [];

    dom.window.document.querySelectorAll('#bodyContent li:not([class]), #bodyContent dd:not([class])').forEach(element => {
        if (!element.closest(".mw-parser-output") || element.closest("li")) return true;
        element.querySelectorAll("li,dd").forEach(elementToRemove => elementToRemove.remove());

        eligibleQuotes.push(element.textContent);
    });

    const numberWordsToKeep = getRandomInt(3, 5);
    let selectedQuote = eligibleQuotes[getRandomInt(0, eligibleQuotes.length)];
    if (!selectedQuote) return "";
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

exports.getAllInfo = async(req, res) => {

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

    const albumData = applyAlbumStyle({ artist: { text: bandName }, title: { text: albumTitle }, coverImage: { url: albumCoVer } });
    res.render('index', albumData);
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


function titleTransformer(titleData, titleStyle) {
    titleData.classes = [];

    Object.keys(titleStyle).forEach(styleElement => {
        switch (styleElement) {
            case "ending":
                break;
            default:
                titleData.classes.push(`${styleElement}--${titleStyle[styleElement]}`)
        }
    })

    titleData.classes = titleData.classes.join(" ");
    return titleData;
}

function artistTransformer(artistData, artistStyle) {
    artistData.classes = [];

    Object.keys(artistStyle).forEach(styleElement => {
        switch (styleElement) {
            case "ending":
                break;
            default:
                artistData.classes.push(`${styleElement}--${artistStyle[styleElement]}`)
        }
    })

    artistData.classes = artistData.classes.join(" ");
    return artistData;
}

function coverTransformer(coverData, coverStyle) {
    coverData.classes = [];

    Object.keys(coverStyle).forEach(styleElement => {
        switch (styleElement) {
            case "ending":
                break;
            default:
                coverData.classes.push(`${styleElement}--${coverStyle[styleElement]}`)
        }
    })

    coverData.classes = coverData.classes.join(" ");
    return coverData;
}

const parsers = {
    title: titleTransformer,
    artist: artistTransformer,
    coverImage: coverTransformer
}

function applyAlbumStyle(albumData) {
    const albumStyleToApply = albumStyles[getRandomInt(0, albumStyles.length - 1)];
    Object.keys(albumData).forEach(albumDataElement => {
        const elementData = albumData[albumDataElement];
        const styleData = albumStyleToApply[albumDataElement];
        if (styleData)
            albumData[albumDataElement] = parsers[albumDataElement](elementData, styleData);
    });
    return albumData;
}