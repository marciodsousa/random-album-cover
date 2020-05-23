import "./main.scss";
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import mutationsModel from '../mutationsModel';

const artistOptions = document.querySelector(".artist_variations__wrapper");
const titleOptions = document.querySelector(".title_variations__wrapper")

Object.keys(mutationsModel.text).forEach(textMutationCategory => {
            const category = mutationsModel.text[textMutationCategory];
            let html = "";

            // render select
            if (!category.multipleAllowed) {
                html = `
        <div>
            <label class="mutation__title" for="${textMutationCategory}">${capitalizeFirstLetter(textMutationCategory)}</label>

            <select name="${textMutationCategory}" id="${textMutationCategory}">
                ${category.options.map(option => `<option value="${textMutationCategory}--${option}">${capitalizeFirstLetter(option)}</option>`)}
            </select>
        </div>`;
    } else {
        html = `
        <div>
            <label class="mutation__title">${capitalizeFirstLetter(textMutationCategory)}</label>
            ${category.options.map(option =>
                `<input type="checkbox" id="${textMutationCategory}--${option}" name="${textMutationCategory}--${option}">
                <label class="mutation__option" for="${textMutationCategory}--${option}">${option}</label>`
            )}
        </div>`;
    }

    artistOptions.insertAdjacentHTML('beforeend', html);
    titleOptions.insertAdjacentHTML('beforeend', html);
});


// Event listeners
document.querySelector(".page__styles").addEventListener('change', event => {
    const selectorToUpdate = event.target.closest(".artist_variations__wrapper") ? ".cover__artist" : ".cover__title";
    if (event.target.nodeName === "INPUT") {
        const classToToggle = event.target.getAttribute('name');
        return document.querySelector(selectorToUpdate).classList.toggle(classToToggle);

    }
    const classToAdd = event.target.value
    const classCategory = classToAdd.split("--")[0];
    const targetElement = document.querySelector(selectorToUpdate);

    targetElement.classList.forEach(className => {
        if (className.startsWith(classCategory)) {
            targetElement.classList.remove(className);
        }
      });

    targetElement.classList.toggle(classToAdd);
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
    setTimeout(() => document.querySelector(".content__wrapper").classList.toggle("opened"), 500);

});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}