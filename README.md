## 'Reliability of web-based affective auditory stimulus presentation' task

This web task was programmed with ReactJS and bootstrapped with [Create React App](https://create-react-app.dev/).

The web task includes:

- [Headphone check](https://github.com/mcdermottLab/HeadphoneCheck) from [Woods et al. 2017](http://mcdermottlab.mit.edu/papers/Woods_etal_2017_headphone_screening.pdf)
- Frequency toggle with the use of [tone.js](https://tonejs.github.io/)
- Audio ratings
- Questionnaires (STAI-Y, OCIR)

To run the experiment:

1. On localhost:

- Download repository
- In audio-pilot > package.json, ensure:
- "scripts": { "start": "react-scripts start" }
- Install NPM (Node package manager) and Node.js.
- Install Babel (JS compiler): `npm install babel-core babel-loader babel-preset-env babel-preset-react babel-webpack-plugin --save-dev`
- Install React JS: `npm install -g create-react-app`
- To start React app, cd to project folder and run: `npm start`

2. On \b server:

- Fork repository
- Use a Platform as a Service (PaaS) such as [Scalingo](https://scalingo.com/) to deploy with Github

To include a database, modify DATABASE_URL in audio-pilot > src > Components > config.js
