const mutationsModel = {
    text: {
        font: { multipleAllowed: false, options: ["fruktur", "bangers", "pacifico", "arima", "quicksand", "open", "roboto", "monoton", "allan", "megrim", "bungee", "biorhyme"] },
        case: { multipleAllowed: true, options: ["upper", "lower", "capitalize", "camel"] },
        format: { multipleAllowed: true, options: ["bold", "underline", "normal", "strikethrough", "italic", "overline"] },
        ending: { multipleAllowed: false, options: ["fullstop", "exclamation", "question", "ellipsis"] },
        spacing: { multipleAllowed: false, options: ["spaced", "close"] },
        style: { multipleAllowed: true, options: ["glowing", "deep", "hero", "news", "pop", "emboss", "outline-shadow"] },
        "position-x": { multipleAllowed: false, options: ["start", "center", "end"] },
        "position-y": { multipleAllowed: false, options: ["start", "center", "end"] }
    },
    background: ["bnw", "high-contrast", "low-contrast", "sepia", "low-brightness", "high-brightness", "hue-variation"],
    misc: { multipleAllowed: true, options: ["dark", "parental"] }
};

module.exports = mutationsModel;