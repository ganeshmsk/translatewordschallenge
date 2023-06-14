const fs = require('fs');

// Function to read a text file
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Read the text files
const shakespeareText = readFile('t8.shakespeare.txt');
const findWordsList = readFile('find_words.txt');
const dictionary = readFile('french_dictionary.csv');

// Parse the dictionary file into a dictionary object
const dictionaryObject = {};
const dictionaryLines = dictionary.trim().split('\n');
for (const line of dictionaryLines) {
  const [english, french] = line.split(',');
  dictionaryObject[english] = french;
}

// Load the words to be replaced from the find words list
const wordsToReplace = findWordsList.trim().split('\n');

// Function to replace a word with its French equivalent
function replaceWord(word) {
  if (wordsToReplace.includes(word) && dictionaryObject[word]) {
    // Word is in the find words list and has a replacement in the dictionary
    return dictionaryObject[word];
  }
  return word; // Word remains unchanged
}

// Replace the words in the Shakespeare text
const processedWords = shakespeareText.split(/\b(\w+)([^\w]*)/g).map(replaceWord);
const processedText = processedWords.join('');

// Get unique replaced words and their counts
const uniqueReplacedWords = {};
for (const word of wordsToReplace) {
  if (dictionaryObject[word]) {
    uniqueReplacedWords[word] = 0;
  }
}
for (const word of processedWords) {
  if (wordsToReplace.includes(word) && dictionaryObject[word]) {
    uniqueReplacedWords[word]++;
  }
}
const replacedWordCount = Object.keys(uniqueReplacedWords).length;

// Calculate the time taken to process
const startTime = process.hrtime();
// ... Your processing code ...
const endTime = process.hrtime(startTime);
const processingTime = `${endTime[0]}s ${endTime[1] / 1000000}ms`;

// Calculate the memory usage
const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;

// Write output files
fs.writeFileSync('frequency.csv', 'English word,French word,Frequency\n');
for (const word in uniqueReplacedWords) {
  const frequency = uniqueReplacedWords[word];
  const line = `${word},${dictionaryObject[word]},${frequency}\n`;
  fs.appendFileSync('frequency.csv', line);
}

fs.writeFileSync('t8.shakespeare.translated.txt', processedText);

const performanceData = `Time to process: ${processingTime}\nMemory used: ${usedMemory.toFixed(2)} MB`;
fs.writeFileSync('performance.txt', performanceData);

fs.writeFileSync('githublink.txt', 'https://github.com/ganeshmsk/translatewordschallenge');
