USAT-Graphics-Kit
============

# What this kit does
- runs autoprefixer on CSS
- bundles JS files via Webpack/Babel
- runs a dev server with live reload
- runs a build and deploys project to CDN

# Dependencies
This kit depends on NodeJS, and currently suppports version 10.13.0 and above.

# Getting Started

To start a new standalone project from this template, clone this repository into a new directory:
```
git clone git@github.com:USATODAY/usat-graphics-kit.git <project-folder>
```

Then run the setup script:
```
npm run setup 
```

This will setup the template and install dependencies as a clean project.

## Start running project locally

Once the project has been initialized, to run it locally, run:

```
npm start
```

## Deploying
To deploy to USA TODAY's CDN, run
```
npm run deploy
```

This will build production ready files and upload them. 

Gannett CDN credentials must be stored as a keyfile in your user folder for this to work, and you must define $CDN_AUTH as an environment variable in order to bust cache.
