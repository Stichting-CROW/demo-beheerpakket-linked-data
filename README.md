# demo-beheerpakket-linked-data

Voorbeeldimplementatie van software die werkt op basis van NEN 2660-2:2022

# IMBOR resources

For querying IMBOR we use the following resources:

- https://hub.laces.tech/crow/imbor/2022/p/vocabulaire
- https://hub.laces.tech/crow/imbor/2022/p/kern
- https://hub.laces.tech/crow/imbor/2022/p/domeinwaarden
- https://hub.laces.tech/crow/imbor/2022/p/informatief
- https://hub.laces.tech/crow/imbor/2022/p/aanvullend-metamodel

Read the docs on how to authenticate and query for the Laces Hub: https://docs.laces.tech/hub/9.0.8/security.html#authentication

To browse through the onto, check:

- https://docs.crow.nl/onto-verkenner/imbor/#/view

# Running this app

## Prerequisites

- Duplicate `.env.example` to `.env`
- Configure the `REACT_APP_IMBOR_TOKEN` variable

## Available Scripts

### `npm install`

Installs all dependencies.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn SPARQL, check https://www.w3.org/2009/Talks/0615-qbe/ 

# Libraries

In this demo app we use the following libraries:

- https://github.com/andrelandgraf/react-datalist-input

Potentially interesting libraries:

- https://comunica.dev/docs/query/getting_started/query_app/
