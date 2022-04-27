# USA TODAY/AP/Northeastern University Mass Killings data project front-end

This project is the front-end, user-facing version of the collaboration between USA TODAY, the Associated Press, and Northeastern University. The page will serve as an overview of the latest data in the data set, employing a visually-driven way of illuminating the facts around mass killings in the United States.

## Who is involved
From USA TODAY graphics:
- Mitchell Thorson mthorson@usatoday.com
- Shawn Sullivan sjsullivan@usatoday.com
- Veronica Bravo vbravo@usatoday.com
- Karina Zaiets kzaiets@usatoday.com

From AP:
- Seth Rasmussen srasmussen@ap.org
- Justin Myers jmyers@ap.org
- Troy Thibodeaux tthibodeaux@ap.org
- Josh Hoffner jhoffner@ap.org

From Northeastern:
- Dr. Jamie Fox j.fox@northeastern.edu

## About the data

The data is managed with an application maintained by AP, located at: http://mka.ap.org/

Login credentials can be obtained from Seth Rasmussen. API access is also available and is used to power this front end.

A [seperate repo](https://github.com/USATODAY/mass-killings-data-updates) exists to manage pulling and updating data on the backend.

## Design

Style and art direction led by Veronica Bravo, and data viz work led by Mitchell Thorson. Medium-fidellity mockup of front-end can be seen here:

https://gannett-my.sharepoint.com/:b:/p/mthorson/ESlrbK-MAjhFvtXHc8-WfcwBifZbLvU4Em6o_Dw8sC7ZhQ?e=icrl0J


## Dependencies
This project depends on NodeJS, and currently suppports version 10.13.0 and above. Install project dependencies with:
```
npm install
```

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
