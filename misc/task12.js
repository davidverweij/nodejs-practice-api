import { createReadStream, createWriteStream } from 'fs';
import csv from 'csvtojson';
import { pipeline } from 'stream';

const inFile = './misc/csv/task12.csv';
const outFile = './misc/csv/task12.txt';

// read in csv, convert to json and write to text
pipeline(
    createReadStream(inFile),
    csv(),
    createWriteStream(outFile),
    (error) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Completed.');
        }
    }
);
