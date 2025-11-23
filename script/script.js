const words = [
    { word: "ERROR", hint: "A word you see when something goes wrong" },
    { word: "KING", hint: "Who rules the Ice Kingdom" },
    { word: "PRINCESS", hint: "Royal girls in Ooo" },
    { word: "ADVENTURE", hint: "The first word in the name of the cartoon" },
    { word: "MAGIC", hint: "Many things in Ooo use it" }
];

const maxAttempts = 6;

let currentWord = "";
let currentHint = "";
let guessedLetters = new Set();
let wrongAttempts = 0;
let score = 0;
let bestScore = 0;

const overlay = document.getElementById("howOverlay");
const startBtn = document.getElementById("startBtn");
const howBtn = document.getElementById("howBtn");

const wordEl = document.getElementById("word");
const keyboardEl = document.getElementById("keyboard");
const attemptsEl = document.getElementById("attempts");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("bestScore");

const randBtn = document.getElementById("randLetterBtn")
const hintBtn = document.getElementById("hintBtn");
const hintTextEl = document.getElementById("hintText");

document.addEventListener("DOMContentLoaded", () => {
    const savedBest = localStorage.getItem("hangking_best_score");
    if (savedBest) {
        bestScore = parseInt(savedBest, 10) || 0;
        bestScoreEl.textContent = bestScore;
    }

    createKeyboard();
    newRound();
});

startBtn.addEventListener("click", () => {
    overlay.classList.remove("overlay--visible");
});

howBtn.addEventListener("click", () => {
    overlay.classList.add("overlay--visible");
});


function newRound() {
    const random = words[Math.floor(Math.random() * words.length)];
    currentWord = random.word.toUpperCase();
    currentHint = random.hint;
    guessedLetters = new Set();
    wrongAttempts = 0;
    attemptsEl.textContent = maxAttempts;
    hintTextEl.textContent = "";
    resetKeyboard();
    renderWord();
}

function renderWord() {
    let display = "";
    for (let ch of currentWord) {
        if (guessedLetters.has(ch)) {
            display += ch + " ";
        } else {
            display += "_ ";
        }
    }
    wordEl.textContent = display.trim();
}

function createKeyboard() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let ch of letters) {
        const btn = document.createElement("button");
        btn.className = "key";
        btn.textContent = ch;
        btn.dataset.letter = ch;
        btn.addEventListener("click", () => handleLetter(ch, btn));
        keyboardEl.appendChild(btn);
    }

    document.addEventListener("keydown", (e) => {
        const letter = e.key.toUpperCase();
        if (letter.length === 1 && letter >= "A" && letter <= "Z") {
            const btn = [...keyboardEl.children].find(
                b => b.dataset.letter === letter
            );
            if (btn && !btn.disabled) {
                handleLetter(letter, btn);
            }
        }
    });
}

function resetKeyboard() {
    [...keyboardEl.children].forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("correct", "wrong");
    });
}

function handleLetter(letter, btn) {
    btn.disabled = true;

    if (currentWord.includes(letter)) {
        guessedLetters.add(letter);
        btn.classList.add("correct");
        renderWord();
        checkWin();
    } else {
        wrongAttempts++;
        attemptsEl.textContent = maxAttempts - wrongAttempts;
        btn.classList.add("wrong");
        checkLose();
    }
}

function checkWin() {
    let allGuessed = true;
    for (let ch of currentWord) {
        if (!guessedLetters.has(ch)) {
            allGuessed = false;
            break;
        }
    }

    if (allGuessed) {
        score++;
        scoreEl.textContent = score;

        if (score > bestScore) {
            bestScore = score;
            bestScoreEl.textContent = bestScore;
            localStorage.setItem("hangking_best_score", bestScore);
        }

        setTimeout(() => {
            alert(`You guessed the word: ${currentWord}!`);
            newRound();
        }, 200);
    }
}

function checkLose() {
    if (wrongAttempts >= maxAttempts) {
        const lostWord = currentWord;
        score = 0;
        scoreEl.textContent = score;

        setTimeout(() => {
            alert(`You lost! The word was: ${lostWord}`);
            newRound();
        }, 200);
    }
}

hintBtn.addEventListener("click", () => {
    hintTextEl.textContent = currentHint;
});
randBtn.addEventListener("click", () => {
    const hiddenIndices = [];
    for (let i = 0; i < currentWord.length; i++) {
        if (!guessedLetters.has(currentWord[i])) {
            hiddenIndices.push(i);
        }
    }

    if (hiddenIndices.length === 0) return;

    const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
    const letter = currentWord[randomIndex];

    const btn = Array.from(keyboardEl.children).find(b => b.dataset.letter === letter);
    if (btn && !btn.disabled) {
        handleLetter(letter, btn);
    }
});
