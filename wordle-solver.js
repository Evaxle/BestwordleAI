let wordList = [];

// Fetch the word list from the plain text file when the page loads
window.onload = function() {
    fetch('words.txt')
        .then(response => response.text())
        .then(text => {
            wordList = text.split('\n').map(word => word.trim());
        })
        .catch(error => {
            console.error('Error loading word list:', error);
        });
};

function findNextWord() {
    if (wordList.length === 0) {
        alert("Word list is still loading. Please wait a moment.");
        return;
    }

    let guess = getCurrentGuess();
    let filteredWords = filterWords(guess);

    // Sort words by number of vowels (prioritize words with more vowels)
    filteredWords.sort((a, b) => countVowels(b) - countVowels(a));

    // Display the best word suggestion
    document.getElementById('suggested-word').innerText = filteredWords.length > 0 ? filteredWords[0] : 'No words found';
}

function getCurrentGuess() {
    let letters = [];
    let statuses = [];

    for (let i = 1; i <= 5; i++) {
        letters.push(document.getElementById(`letter${i}`).value.toLowerCase());
        statuses.push(document.getElementById(`status${i}`).value);
    }

    return { letters, statuses };
}

function filterWords(guess) {
    return wordList.filter(word => {
        for (let i = 0; i < 5; i++) {
            if (guess.statuses[i] === 'green' && word[i] !== guess.letters[i]) {
                return false; // Green letters must match the exact position
            } else if (guess.statuses[i] === 'yellow' && (word[i] === guess.letters[i] || !word.includes(guess.letters[i]))) {
                return false; // Yellow letters must be in the word but not in the same position
            } else if (guess.statuses[i] === 'gray' && word.includes(guess.letters[i])) {
                return false; // Gray letters must not appear in the word
            }
        }
        return true;
    });
}

function countVowels(word) {
    return word.split('').filter(letter => 'aeiou'.includes(letter)).length;
}
