const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const ColorThief = require("colorthief");

// album elements transformers
const transformers = {
    title: titleTransformer,
    artist: artistTransformer,
    background: coverTransformer
}

// Album presets
const albumStyles = [{
        artist: { font: "fruktur", style: "hero", "position-x": "start", "position-y": "start" },
        title: { font: "biorhyme", case: "lower", ending: "question", spacing: "close", "position-x": "end", "position-y": "end" }
    },
    {
        artist: { font: "megrim", spacing: "spaced", case: "upper", "position-x": "center", "position-y": "center" },
        title: { case: "lower", font: "pacifico", ending: "ellipsis", "position-y": "center", "position-x": "center" }
    },
    {
        artist: { font: "bangers", style: "news", "position-y": "end", "position-x": "end", case: "upper" },
        title: { font: "biorhyme", case: "capitalize", ending: "question", spacing: "close", "position-x": "end", "position-y": "end", format: "underline" }
    },
    {
        artist: { font: "monoton", case: "lower", format: "strikethrough", "position-x": "end", "position-y": "start" },
        title: { font: "allan", case: "upper", format: "bold", ending: "exclamation", "position-x": "end", "position-y": "start" }
    },
    {
        artist: { case: "lower", "position-y": "start", font: "bungee", style: "hero", spacing: "spaced", "position-x": "center" },
        title: { font: "quicksand", case: "lower", format: "underline", ending: "fullstop", spacing: "close", style: "glowing", "position-x": "center", "position-y": "end" }
    },
    {
        artist: { case: "lower", "position-y": "start", font: "allan", style: "deep", "position-x": "start" },
        title: { case: "lower", "position-y": "end", font: "open", format: "strikethrough", ending: "exclamation", spacing: "close", "position-x": "start" }
    },
    {
        artist: { font: "arima", case: "capitalize", "position-x": "end", "position-y": "end" },
        title: { "position-y": "end", font: "pacifico", ending: "ellipsis", case: "lower", "position-x": "end" }
    },
    {
        artist: { case: "capitalize", "position-y": "end", font: "megrim", format: "bold", style: "hero", ending: "exclamation", "position-x": "start" },
        title: { "position-y": "end", case: "lower", font: "bungee", format: "underline", ending: "exclamation", "position-x": "center" }
    },
    {
        artist: { case: "lower", ending: "fullstop", font: "bangers", "position-x": "center", "position-y": "center", style: "news" },
        title: { "position-y": "end", "position-x": "center", font: "arima", case: "camel", format: "bold", ending: "question", spacing: "close" }
    },
    {
        artist: { font: "monoton", format: "overline", case: "lower", style: "pop", "position-y": "center", "position-x": "center" },
        title: { font: "allan", format: "normal", case: "lower", "position-y": "center", "position-x": "center", spacing: "spaced", }
    },
    {
        artist: { font: "megrim", format: "normal", case: "upper", "position-y": "end", "position-x": "start", spacing: "spaced" },
        title: { format: "normal", case: "capitalize", "position-y": "end", "position-x": "start", font: "biorhyme" }
    },
    {
        artist: { font: "pacifico", format: "normal", style: "hero", "position-y": "start", "position-x": "end", case: "lower" },
        title: { format: "normal", case: "lower", "position-y": "start", "position-x": "end", font: "quicksand" }
    },
    {
        artist: { format: "bold", "position-y": "start", "position-x": "end", font: "arima", case: "capitalize" },
        title: { format: "overline", "position-y": "start", "position-x": "end", case: "upper", font: "bungee" }
    },
    {
        title: { font: "pacifico", format: "normal", ending: "question", case: "lower", "position-y": "start", "position-x": "start", spacing: "spaced" },
        artist: { font: "lucky", format: "strikethrough", ending: "question", case: "lower", style: "glowing", "position-y": "start", "position-x": "start" }
    }, {
        title: { font: "allan", format: "normal", ending: "question", case: "lower", "position-y": "center", "position-x": "center", spacing: "spaced" },
        artist: { font: "monoton", format: "overline", ending: "question", case: "lower", style: "pop", "position-y": "center", "position-x": "center" },
    }, {
        title: { font: "fruktur", format: "normal", ending: "question", case: "lower", "position-y": "start", "position-x": "end" },
        artist: { font: "pacifico", format: "normal", ending: "question", case: "lower", style: "hero", "position-y": "start", "position-x": "end" }
    }, {
        title: { font: "bangers", format: "normal", ending: "question", case: "capitalize", "position-y": "end", "position-x": "start" },
        artist: { font: "megrim", format: "normal", ending: "question", case: "upper", "position-y": "end", "position-x": "start", spacing: "spaced" },
    }, {
        title: { font: "biorhyme", format: "italic", ending: "question", case: "camel", "position-y": "start", "position-x": "center" },
        artist: { font: "monoton", format: "normal", ending: "question", case: "lower", "position-y": "start", "position-x": "center", spacing: "spaced" },
    }
];

exports.getFullInfo = async(req, res) => {
    await getAllInfo();
}

exports.getAllInfo = async(req, res) => {

    // define promises to fetch all the different album info asynchronously
    const bandInfo = getWikipediaName()
        .catch(error => {
            throw error;
        });
    const albumInfo = getWikiquoteTitle()
        .catch(error => {
            throw error;
        });
    const backgroundInfo = getFlickrPhoto()
        .catch(error => {
            throw error;
        });

    // wait for all AJAX calls to finish
    const albumRawInfoPromisesResults = await Promise.all([bandInfo, albumInfo, backgroundInfo]);
    const albumRawInfo = {
        bandInfo: albumRawInfoPromisesResults[0],
        albumInfo: albumRawInfoPromisesResults[1],
        backgroundInfo: albumRawInfoPromisesResults[2]
    };

    // parse all the color info for the background image asynchronously
    const palette = getPalette(albumRawInfo.backgroundInfo.photoEndpoint);
    const majorColor = getMajorColor(albumRawInfo.backgroundInfo.photoEndpoint);

    // wait for the color info processing to finish
    const colorInfoPromisesResults = await Promise.all([palette, majorColor]);
    const colorInfo = { palette: colorInfoPromisesResults[0], majorColor: colorInfoPromisesResults[1] };

    const paletteObj = {
        color1: colorInfo.palette[0].join(","),
        color2: colorInfo.palette[1].join(","),
        color3: colorInfo.palette[2].join(",")
    };

    const transformedAlbumData = applyAlbumStyle({
        artist: {
            text: albumRawInfo.bandInfo.chosenArtistName,
            originUrl: albumRawInfo.bandInfo.originUrl
        },
        title: {
            text: albumRawInfo.albumInfo.selectedQuote,
            originUrl: albumRawInfo.albumInfo.originUrl
        },
        background: {
            url: albumRawInfo.backgroundInfo.photoEndpoint,
            originUrl: albumRawInfo.backgroundInfo.originUrl,
            majorColor: colorInfo.majorColor,
            palette: paletteObj
        }
    });

    // validate if main color of the background is "dar" or "Light"
    transformedAlbumData.isCoverImageDark = isColorDark(colorInfo.majorColor);

    res.render("index", transformedAlbumData);
}

async function getWikipediaName(req, res) {
    const response = await axios.get("https://en.wikipedia.org/wiki/Special:Random");
    console.log(response.request.res.responseUrl);
    const dom = new JSDOM(response.data);
    const chosenArtistName = dom.window.document.querySelector("#firstHeading").textContent
    return { chosenArtistName, originUrl: response.request.res.responseUrl };
}


async function getWikiquoteTitle(req, res) {
    const response = await axios.get("https://en.wikiquote.org/wiki/Special:Random")

    console.log(response.request.res.responseUrl);
    const dom = new JSDOM(response.data);
    const eligibleQuotes = [];

    dom.window.document.querySelectorAll("#bodyContent li:not([class]), #bodyContent dd:not([class])").forEach(element => {
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

async function getFlickrPhoto(req, res) {
    const response = await axios.get("https://www.flickr.com/explore/interesting/7days/?")

    console.log(response.request.res.responseUrl);
    const dom = new JSDOM(response.data);
    const photoDom = dom.window.document.querySelectorAll(".Photo")[5]; //get the 5th one
    const photoEndpoint = photoDom.querySelector("img").getAttribute("src").replace("_m.", "_b.")
    const originUrl = `https://www.flickr.com${photoDom.querySelector("a").getAttribute("href")}`;

    return { photoEndpoint, originUrl };
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

// fetched the initial data for the album, time to pick a preset and apply transformations
function applyAlbumStyle(albumData) {
    console.log(albumData);
    // Select one randm album preset
    const albumStyleToApply = albumStyles[getRandomInt(0, albumStyles.length - 1)];

    Object.keys(albumData).forEach(albumDataElement => {
        const elementData = albumData[albumDataElement];
        const styleData = albumStyleToApply[albumDataElement];
        if (styleData)
            albumData[albumDataElement] = transformers[albumDataElement](elementData, styleData);
    });

    // randomize if album requires Parent Supervision
    albumData.parentSupervision = getRandomInt(0, 1) ? true : false;

    return albumData;
}

// Utils functions

function isColorDark(colorRGBArray) {
    const averageBrightness = 0.299 * colorRGBArray[0] + 0.587 * colorRGBArray[1] + 0.114 * colorRGBArray[2];

    return averageBrightness < 127;
}
/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn"t an integer) and no greater than max (or the next integer
 * lower than max if max isn"t an integer).
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