[![Build Status](https://travis-ci.org/marciodsousa/random-album-cover.svg?branch=master)](https://travis-ci.org/marciodsousa/random-album-cover)

# Random Album Cover Generator

Small project created just for fun with the aim to generate random album art based on the following challenge:

![alt text](https://i.imgur.com/WDmQ722.png "Random Album Art Challenge")

This project is composed by a [Node.js](https://www.google.com) app using [jsdom](https://github.com/jsdom/jsdom) to scrape webpages, [Colorthief](https://lokeshdhakar.com/projects/color-thief/) for predominant color info obtention on image, [Webpack](https://webpack.js.org/) for app bundling and [Docker and Docker-compose](https://www.docker.com/) for a ready-to-go local environment. To allow album cover download, [HTML2Canvas](https://html2canvas.hertzen.com/) was used. [Travis CI](https://travis-ci.org/) used for continuous integration and delivery. 

Initial Node app structure was inspired on [Wes Bos initial setup on the _Learn Node_ Course](https://github.com/wesbos/Learn-Node). Vynil record image from [CleanPNG](https://www.cleanpng.com/png-car-product-design-wheel-tire-dystopian-sebastian-6098663/)

## Deployment to Vercel

This project can be easily deployed using Vercel. Vercel is a cloud platform for static sites and Serverless Functions that enables developers to host websites and web services that deploy instantly, scale automatically, and require no supervision.

Follow these steps to deploy the Random Album Cover Generator to Vercel:

1.  **Sign up or Log in to Vercel:** Go to [https://vercel.com](https://vercel.com) and create an account or log in.
2.  **Import Project:**
    *   Click on "New Project".
    *   Import the Git repository for this project (e.g., from GitHub, GitLab, Bitbucket).
3.  **Configure Project (if necessary):**
    *   Vercel will likely detect this as a Node.js project and configure settings automatically using the `vercel.json` file.
    *   The `vercel.json` specifies `src/start.js` as the entry point and `yarn install && webpack` as the build command.
    *   If manual configuration is needed, ensure the "Framework Preset" is set to "Node.js".
    *   The "Build Command" might need to be set to `webpack` (Vercel often handles the `yarn install` part separately or as part of the preset).
    *   The "Output Directory" can usually be left to its default unless your assets are built to a very specific non-standard location not covered by the framework.
    *   The "Install Command" should be `yarn install`.
4.  **Deploy:**
    *   Click the "Deploy" button.
    *   Vercel will build and deploy your application. You'll get a unique URL for your live site.

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