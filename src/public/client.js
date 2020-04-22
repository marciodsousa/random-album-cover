import "./main.scss";
import DomToImage from 'dom-to-image';
import { saveAs } from 'file-saver';

document.getElementById("buttonToClick").addEventListener("click", () => {

    DomToImage.toBlob(document.getElementById('my-node'))
        .then(function(blob) {
            saveAs(blob, 'my-node.png');
        });
});