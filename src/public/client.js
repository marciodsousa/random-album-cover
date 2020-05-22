import "./main.scss";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

document.getElementById("download").addEventListener("click", () => {
    const targetElement = document.querySelector(".cover__wrapper");
    const blacklistElement = document.querySelector(".cover__overlay");
    const initialState = blacklistElement.style.display;
    blacklistElement.style.display = "none";

    html2canvas(targetElement).then(function(canvas) {

        blacklistElement.style.display = initialState;
        // canvas.toBlob(function(blob) {
        //     saveAs(blob, 'my-node.png');
        // }, 'image/jpeg', 0.95); // JPEG at 95% quality

        var base64image = canvas.toDataURL("image/png");

        var url = base64image;

        fetch(url)
            .then(res => res.blob())
            .then(blob => saveAs(blob, 'my-node.png'));

    });


});


document.querySelector(".header.info-text").addEventListener("click", () => {

    document.querySelector(".page__styles").classList.toggle("opened");
});
document.querySelector(".content__wrapper").addEventListener("click", (event) => {

    event.currentTarget.classList.toggle("opened");
});


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

const artistOptions = document.querySelector(".artist_variations__wrapper");
const titleOptions = document.querySelector(".title_variations__wrapper")

Object.keys(textMutations).forEach(textMudationCategory => {
    textMutations[textMudationCategory].forEach(textMudation => {
        const html = `
        <div>
            <input type="checkbox" id="${textMudationCategory}--${textMudation}" name="${textMudationCategory}--${textMudation}">
            <label for="${textMudationCategory}--${textMudation}">${textMudationCategory.toUpperCase()}: ${textMudation}</label>
        </div>`;

        artistOptions.insertAdjacentHTML('beforeend', html);
        titleOptions.insertAdjacentHTML('beforeend', html);
    });
});



document.querySelector(".page__styles").addEventListener('change', event => {
    const selectorToUpdate = event.target.closest(".artist_variations__wrapper") ? ".cover__artist" : ".cover__title";
    const classToToggle = event.target.getAttribute('name');
    document.querySelector(selectorToUpdate).classList.toggle(classToToggle);
});