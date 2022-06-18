// DOM Elements
const questionEl = document.getElementById("question");
const optionsEl = document.querySelector(".trivia-options");
const confirmAnswerBtn = document.getElementById("confirm-answer");
const playAgainBtn = document.getElementById("play-again");
const resultsEl = document.getElementById("results");
const confirmScoreEl = document.getElementById("confirm-score");
const totalQuestionEl = document.getElementById("total-question");

let correctAnswer = "", confirmScore = (questionCount = 0), totalQuestion = 5;

// Get question from API
const getQuestion = async () => {
  try {
    // Open Trivia DB API
    const triviaAPI = "https://opentdb.com/api.php?amount=1&difficulty=easy";
    const result = await fetch(triviaAPI);
    console.log(result.ok);
    const data = await result.json();
    resultsEl.innerHTML = "";
    displayQuestion(data.results[0]);
  } catch (err) {
    console.error(err);
  }
};

// Event listeners
let eventListeners = () => {
  confirmAnswerBtn.addEventListener("click", confirmAnswer);
  playAgainBtn.addEventListener("click", playAgain);
};

document.addEventListener("DOMContentLoaded", () => {
  getQuestion();
  eventListeners();
  totalQuestionEl.textContent = totalQuestion;
  confirmScoreEl.textContent = confirmScore;
});

// Display question and answer options
let displayQuestion = (data) => {
  // saveBtn.style.display = 'none';
  confirmAnswerBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let answerOptions = incorrectAnswer;
  answerOptions.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

  questionEl.innerHTML = `${data.question} <br> <span class="category">${data.category} </span>`;
  optionsEl.innerHTML = `${answerOptions.map((option, index) => `<li> ${index + 1}. <span>${option}</span> </li>`).join("")}`;

  chooseAnswer();
};

// options selection
let chooseAnswer = () => {
  optionsEl.querySelectorAll("li").forEach(function (option) {
    option.addEventListener("click", function () {
      if (optionsEl.querySelector(".selected")) {
        const activeOption = optionsEl.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
  console.log(correctAnswer);
};

// Confirm answer
let confirmAnswer = () => {
  confirmAnswerBtn.disabled = true;
  if (optionsEl.querySelector(".selected")) {
    let selectedAnswer = optionsEl.querySelector(".selected span").textContent;

    if (selectedAnswer == HTMLDecode(correctAnswer)) {
      confirmScore++;
      resultsEl.innerHTML = `<p><i class="fas fa-check"></i>Correct Answer!</p>`;
    } else {
      resultsEl.innerHTML = `<p><i class="fas fa-times"></i>Incorrect Answer!</p><b>Correct: Answer: </b>${correctAnswer}`;
    }
    checkQuestionCount();
  } else {
    resultsEl.innerHTML = `<p><i class="fas fa-question"><i/>Please select an option!</p>`;
    confirmAnswerBtn.disabled = false;
  }
};

// to convert html entities into normal text of correct answer if there is any
let HTMLDecode = (textString) => {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
};

function storeScore(obj) {
  let getConfirmScore = JSON.parse(localStorage.getItem("High Score")) || [];

  getConfirmScore.push(obj);
  localStorage.setItem("High Score", JSON.stringify(getConfirmScore));
}

let checkQuestionCount = () => {
  questionCount++;
  questionLimit();
  if (questionCount == totalQuestion) {
    setTimeout(function () {
      console.log("");
    }, 5000);

    resultsEl.innerHTML += `<p>Your score is ${confirmScore}.</p>`;
    storeScore(confirmScore);
    playAgainBtn.style.display = "block";
    confirmAnswerBtn.style.display = "none";
  } else {
    setTimeout(function () {
      getQuestion();
    }, 500);
  }
  // saveScore();
};

let questionLimit = () => {
  totalQuestionEl.textContent = totalQuestion;
  confirmScoreEl.textContent = confirmScore;
};

let playAgain = () => {
  confirmScore = questionCount = 0;
  playAgainBtn.style.display = "none";
  confirmAnswerBtn.style.display = "block";
  confirmAnswerBtn.disabled = false;
  questionLimit();
  getQuestion();
};
