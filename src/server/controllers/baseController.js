const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const ColorThief = require('colorthief');

const textMutations = {
    case: ["upper", "lower", "capitalize", "camel"],
    font: ["edgy", "classic", "cursive", "lucky"],
    format: ["bold", "underline", "normal", "strikethrough"],
    ending: ["fullstop", "exclamation", "question", "ellipsis"],
    spacing: ["spaced", "close"],
    style: ["glowing", "deep", "hero", "news", "outline"],
    "position-x": ["start", "center", "end"],
    "position-y": ["start", "center", "end"]
};
const backgroundMutatons = ["bnw", "high-contrast", "low-contrast", "sepia", "low-brightness", "high-brightness", "hue-variation"];
const textPositionMutations = { x: ["start", "center", "end"], y: ["start", "center", "end"] };

const albumStyles = [{
    title: { font: "edgy", format: "normal", ending: "question", case: "lower", "position-y": "start", "position-x": "start", spacing: "spaced" },
    artist: { font: "lucky", format: "strikethrough", ending: "question", case: "lower", style: "glowing", "position-y": "start", "position-x": "start" }
}, {
    title: { font: "edgy", format: "normal", ending: "question", case: "lower", "position-y": "center", "position-x": "center", spacing: "spaced" },
    artist: { font: "classic", format: "overline", ending: "question", case: "lower", style: "outline", "position-y": "center", "position-x": "center" },
}, {
    title: { font: "lucky", format: "normal", ending: "question", case: "lower", "position-y": "start", "position-x": "end" },
    artist: { font: "cursive", format: "normal", ending: "question", case: "lower", style: "hero", "position-y": "start", "position-x": "end" }
}, {
    title: { font: "classic", format: "normal", ending: "question", case: "capitalize", "position-y": "end", "position-x": "start" },
    artist: { font: "lucky", format: "normal", ending: "question", case: "upper", "position-y": "end", "position-x": "start", spacing: "spaced" },
}, {
    title: { font: "edgy", format: "italic", ending: "question", case: "camel", "position-y": "start", "position-x": "center" },
    artist: { font: "cursive", format: "normal", ending: "question", case: "lower", "position-y": "start", "position-x": "center", spacing: "spaced" },
}];

exports.getFullInfo = async(req, res) => {
    await getAllInfo();

}

exports.getWikipediaName = async(req, res) => {
    const response = await axios.get('https://en.wikipedia.org/wiki/Special:Random');
    console.log(response.request.res.responseUrl);
    const dom = new JSDOM(response.data);
    const chosenArtistName = dom.window.document.querySelector("#firstHeading").textContent
    return { chosenArtistName, originUrl: response.request.res.responseUrl };
}


exports.getWikiquoteTitle = async(req, res) => {
    const response = await axios.get('https://en.wikiquote.org/wiki/Special:Random')

    console.log(response.request.res.responseUrl);
    const dom = new JSDOM(response.data);
    const eligibleQuotes = [];

    dom.window.document.querySelectorAll('#bodyContent li:not([class]), #bodyContent dd:not([class])').forEach(element => {
        if (!element.closest(".mw-parser-output") || element.closest("li")) return true;
        element.querySelectorAll("li,dd").forEach(elementToRemove => elementToRemove.remove());

        eligibleQuotes.push(element.textContent);
    });

    const numberWordsToKeep = getRandomInt(3, 5);
    let selectedQuote = eligibleQuotes[getRandomInt(0, eligibleQuotes.length)];
    const ret = { originUrl: response.request.res.responseUrl, selectedQuote: "untitled" };
    if (!selectedQuote) return ret;
    try {
        selectedQuote = selectedQuote.slice(0, selectedQuote.length).split(" ").slice(-1 * numberWordsToKeep).join(" ");
    } catch (e) {
        console.log(e);
    }
    ret.selectedQuote = selectedQuote;
    return ret;

}

exports.getFlickrPhoto = async(req, res) => {
    const response = await axios.get('https://www.flickr.com/explore/interesting/7days/?')

    console.log(response.request.res.responseUrl);
    const dom = new JSDOM(response.data);
    const photoDom = dom.window.document.querySelectorAll(".Photo")[5]; //get the 5th one
    const photoEndpoint = photoDom.querySelector("img").getAttribute("src").replace("_m.", "_b.")


    return { photoEndpoint, originUrl: response.request.res.responseUrl };
}

exports.getAllInfo = async(req, res) => {

    const bandInfo = await exports.getWikipediaName()
        .catch(error => {
            throw error;
        });
    const albumInfo = await exports.getWikiquoteTitle()
        .catch(error => {
            throw error;
        });
    const backgroundInfo = await exports.getFlickrPhoto()
        .catch(error => {
            throw error;
        });

    const palette = await getPalette(backgroundInfo.photoEndpoint);
    const majorColor = await getMajorColor(backgroundInfo.photoEndpoint);
    const averageBrightness = 0.299 * majorColor[0] + 0.587 * majorColor[1] + 0.114 * majorColor[2];
    const isCoverImageDark = averageBrightness < 127;

    const paletteObj = {
        color1: palette[0].join(","),
        color2: palette[1].join(","),
        color3: palette[2].join(",")
    }
    const albumData = applyAlbumStyle({
        artist: { text: bandInfo.chosenArtistName, originUrl: bandInfo.originUrl },
        title: { text: albumInfo.selectedQuote, originUrl: albumInfo.originUrl },
        background: { url: backgroundInfo.photoEndpoint, originUrl: backgroundInfo.originUrl, majorColor, palette: paletteObj, paletteArray: JSON.stringify(palette) }
    });
    albumData.isCoverImageDark = isCoverImageDark;
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

async function getPalette(url) {
    return ColorThief.getPalette(url, 3)
}
async function getMajorColor(url) {
    return ColorThief.getColor(url)
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

    if (titleData.text.length < 10) {
        titleData.classes.push("size--large");
    } else if (titleData.text.length > 20) {
        titleData.classes.push("size--small");
    }

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
    if (artistData.text.length < 15) {
        artistData.classes.push("size--large");
    } else if (artistData.text.length > 30) {
        artistData.classes.push("size--small");
    }
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
    background: coverTransformer
}

function applyAlbumStyle(albumData) {
    const albumStyleToApply = albumStyles[getRandomInt(0, albumStyles.length - 1)];
    Object.keys(albumData).forEach(albumDataElement => {
        const elementData = albumData[albumDataElement];
        const styleData = albumStyleToApply[albumDataElement];
        if (styleData)
            albumData[albumDataElement] = parsers[albumDataElement](elementData, styleData);
    });
    albumData.parentSupervision = getRandomInt(0, 1) ? true : false;

    return albumData;
}