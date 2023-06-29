# F1 Racing Result App
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <img width='150px' src="https://1000logos.net/wp-content/uploads/2021/06/F1-logo.png">
</div>
<h3 align="center">F1 Racing Result App</h3>
</div>


## F1 Racing Result App

This project was created for submitting the test of the interview at VRILLAR VIETNAM.

## Contributors
- Duyduong689 a.k.a Thạch Dương Duy

## Framework and Technology
### Requirement
- npm version greater than 9.5.1
```sh
npm install -g npm@9.5.1
```
- Nodejs version 18.16.0
```sh
https://nodejs.org/en/blog/release/v18.16.0
```
- ReactJS (Front-End) & Typescript
- Libraries using: Axios, React-Query, Ant Design
## How to run the project locally (Follow the sequence)
*Note: Before running this application, please turn off your browser CORS to it works correctly. By one of these methods: 
1. Follow the instructions will be done by this site: https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome.
2. Adding a proxy to bypass CORS (This will be limited on request call) by the following steps:
- Open the frontend folder, navigate to ./src/utils/AxiosInstance.js file
- In the AxiosInstance.js file change the code at line 2 from
``` sh
export const baseURL = "https://www.formula1.com/en/results/jcr:content/resultsarchive.html";
```
To
``` sh
export const baseURL = "https://api.allorigins.win/raw?url=https://www.formula1.com/en/results/jcr:content/resultsarchive.html";
```
### Front-End 
1. Go to the frontend folder, then type **"npm i"** in the terminal to install all the necessary libraries
2. Then type: **"npm start"** to run the Front-End
3. The Frontend will start on http://localhost:3000

## Contribution
For any information please contact us through these email: 
```sh
duyduong365900.it@gmail.com
```
