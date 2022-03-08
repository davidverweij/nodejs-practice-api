const fs = require('fs');
const csvtojson = require('csvtojson');
const { pipeline } = require('stream');

const inFile = './csv/task12.csv';
const outFile = './csv/task12.txt';

// read in csv, convert to json and write to text
pipeline(
    fs.createReadStream(inFile),
    csvtojson(),
    fs.createWriteStream(outFile),
    (error) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Completed.');
        }
    }
);