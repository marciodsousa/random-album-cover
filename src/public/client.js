import "./main.scss";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

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


// Event listeners
document.querySelector(".page__styles").addEventListener('change', event => {
    const selectorToUpdate = event.target.closest(".artist_variations__wrapper") ? ".cover__artist" : ".cover__title";
    const classToToggle = event.target.getAttribute('name');
    document.querySelector(selectorToUpdate).classList.toggle(classToToggle);
});

document.getElementById("download").addEventListener("click", () => {
    const targetElement = document.querySelector(".cover__wrapper");

    html2canvas(targetElement, { useCORS: true }).then(canvas => {
        const base64image = canvas.toDataURL("image/png");
        const url = base64image;

        fetch(url)
            .then(res => res.blob())
            .then(blob => saveAs(blob, 'random-album-cover.png'));
    });
});
document.getElementById("refresh").addEventListener("click", () => {
    location.reload();
});

document.getElementById("tweak").addEventListener("click", () => {
    document.querySelector(".page__styles").classList.toggle("opened");
});

document.querySelector(".content__wrapper").addEventListener("click", event => {
    event.currentTarget.classList.toggle("opened");
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".content__wrapper").classList.toggle("opened");
});