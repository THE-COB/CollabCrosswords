# ColabCrosswords
A Node JS application to allow multiple people to work on the same crossword at the same time using websockets

## Installation
Fetch the repository and then
```bash
npm install
```

## Usage
Go to any NyTimes crossword (may require a subscription) and paste the javascript code in nytimesReader.js into the console in inspect element.

This will download two files which you put into the folder of the repository. Then you change the values in the code for the clue file and xw file and just run
```bash
node index.js
```
For the client, go to *:3000

HAVE FUN!

## Coming Soon
Configuration file for the clue and xw file

Function that focusses on the input beginning a clue number when you click on the clue
