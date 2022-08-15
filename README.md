# USA TODAY/AP/Northeastern University Mass Killings data project front-end

This project is the front-end, user-facing version of the collaboration between USA TODAY, the Associated Press, and Northeastern University. The page will serve as an overview of the latest data in the data set, employing a visually-driven way of illuminating the facts around mass killings in the United States.

## Dependencies

This project depends on NodeJS, and currently suppports version 16.15.0 and above. Install project dependencies with:

```
npm install
```

## Start running project locally

Once the project has been initialized, to run it locally, run:

```
npm start
```

By default, the app will download a copy of the production data to a local folder and will use this local copy during development. To sync the latest data from the server to your local development enviroment, run: 

```
npm run data
```

If you would copy data from the `dev` CDN folder (maybe you are working on something that requires a new piece of data or format that you are developing in the backend repo, [read more about the data here](#about-the-data)), you can load it with:

```
npm run data:development
```

This will sync the data to the `src/static/data/cache` local folder. This folder is ignored by git, so needs to be kept up to date manually. Re-running the command will grab any updates from the server.

You can also run the project locally and pull data directly from the `production` or `development` server location by running:

```
npm run dev:production-data
```

or

```
npm run dev:development-data
```

## Deploying

To deploy to USA TODAY's CDN, run

```
npm run deploy
```

By default, this will build production ready files, with production data and upload them to the production CDN folder.

Gannett CDN credentials must be stored as a keyfile in your user folder for this to work, and you must define `$CDN_AUTH` as an environment variable in order to bust cache.

If you would like to build with development data, and deploy to the development CDN folder, you can run:

```
npm run deploy:development
```

## About the data

A [seperate repo](https://github.com/USATODAY/mass-killings-data-updates) exists to manage pulling and updating data on the backend.

The data is managed with an application maintained by AP, located at: http://mka.ap.org/

Read more about the data, and how to access the database tool at the [backend repo](https://github.com/USATODAY/mass-killings-data-updates#readme).

## Design

Style and art direction led by Veronica Bravo, and data viz work led by Mitchell Thorson. Medium-fidellity mockup of front-end can be seen here:

https://www.figma.com/file/CZJ286X4EyMSQG3fpQQTLu/mass_killings_mockup_2022?node-id=0%3A1

## Project partners

Who are the key people involved?

| Name             | org          | email                   | role                                                                  |
|------------------|--------------|-------------------------|-----------------------------------------------------------------------|
| Josh Hoffner     | AP           | jhoffner@ap.org         | AP news editor for national                                           |
| Troy Thibodeaux  | AP           | tthibodeaux@ap.org      | AP director of digital news                                           |
| Justin Myers     | AP           | jmyers@ap.org           | AP data director                                                      |
| Seth Rasmussen   | AP           | srasmussen@ap.org       | AP admin/data developer                                               |
| James Fox        | Northeastern | j.fox@northeastern.edu  | Northeastern University professer of Criminology, Law & Public Policy |
| Mitchell Thorson | USA Today    | mthorson@usatoday.com   | USA Today graphics journalist                                         |
| Shawn Sullivan   | USA Today    | sjsullivan@usatoday.com | USA Today editor interactives                                         |
| Veronica Bravo   | USA Today    | vbravo@usatoday.com     | USA Today art director                                                |
| Karina Zaiets    | USA Today    | kzaiets@usatoday.com    | USA Today graphics reporter                                           |
| George Petras    | USA Today    | gpetras@usatoday.com    | USA Today graphics reporter                                           |


