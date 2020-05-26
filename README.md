[![Build Status](https://travis-ci.org/marciodsousa/random-album-cover.svg?branch=master)](https://travis-ci.org/marciodsousa/random-album-cover)

# Random Album Cover Generator

Small project created just for fun with the aim to generate random album art based on the following challenge:

![alt text](https://i.imgur.com/WDmQ722.png "Random Album Art Challenge")

This project is composed by a [Node.js](https://www.google.com) app using [jsdom](https://github.com/jsdom/jsdom) to scrape webpages, [Colorthief](https://lokeshdhakar.com/projects/color-thief/) for predominant color info obtention on image, [Webpack](https://webpack.js.org/) for app bundling and [Docker and Docker-compose](https://www.docker.com/) for a ready-to-go local environment. To allow album cover download, [HTML2Canvas](https://html2canvas.hertzen.com/) was used. [Travis CI](https://travis-ci.org/) used for continuous integration and delivery. 

Initial Node app structure was inspired on [Wes Bos initial setup on the _Learn Node_ Course](https://github.com/wesbos/Learn-Node). Vynil record image from [CleanPNG](https://www.cleanpng.com/png-car-product-design-wheel-tire-dystopian-sebastian-6098663/)

## Keywords:
- jsdom 
- TravisCI
- CI/CD
- Async/Await
- Node
- Docker
- CSS-Grid
- SASS
- CSS Variables
- Webpack
- Handlebars
- Google Fonts
- PM2
- HTML2Canvas

Access the result at http://album-cover.marciodesousa.xyz.