"use strict";

const scoreNum = document.querySelector(".score-num");
const scoreOutline = document.querySelector(".score-outline");
const winsNum = document.querySelector(".wins-num");

/* ==================================================== */
/* GET PUZZLES FUNCTIONS */
/* ==================================================== */

async function getPuzzlePeople() {
  const fileAnswerUrls = "./answer_urls.json";
  const filePeople = "./people.json";
  const fileUrl = "./urls.json";

  const requestPeople = new Request(filePeople);
  const requestUrl = new Request(fileUrl);
  const requestAnswerUrls = new Request(fileAnswerUrls);

  const responsePeople = await fetch(requestPeople);
  const responseUrl = await fetch(requestUrl);
  const responseAnswerUrls = await fetch(requestAnswerUrls);

  const peoples = await responsePeople.json();
  const urls = await responseUrl.json();
  const answerUrls = await responseAnswerUrls.json();

  const randomKey = randomObj(peoples[0]);
  const answer = peoples[0][randomKey].toUpperCase();
  const puzzles = peoples[1][randomKey];
  const puzzle = puzzles[randomArr(puzzles)];
  const answerUrl = answerUrls[peoples[0][randomKey]].split(" ")[1];
  const urlArr = [];

  for (let i = 0; i < puzzle.length; i++) {
    const urlInt = randomArr(urls[puzzle[i]]);
    const url = urls[puzzle[i]][urlInt].split(" ")[1];
    urlArr.push(url);

    localStorage.setItem("urlsPeople", JSON.stringify(urlArr));
    localStorage.setItem("inputsPeople", JSON.stringify(puzzle));
    localStorage.setItem("answerPeople", answer);
    localStorage.setItem("answerUrlPeople", answerUrl);
  }
  window.location.reload();
}

async function getPuzzlePlaces() {
  const fileAnswerUrls = "./answer_urls.json";
  const filePlaces = "./places.json";
  const fileUrl = "./urls.json";

  const requestPlaces = new Request(filePlaces);
  const requestUrl = new Request(fileUrl);
  const requestAnswerUrls = new Request(fileAnswerUrls);

  const responsePlaces = await fetch(requestPlaces);
  const responseUrl = await fetch(requestUrl);
  const responseAnswerUrls = await fetch(requestAnswerUrls);

  const places = await responsePlaces.json();
  const urls = await responseUrl.json();
  const answerUrls = await responseAnswerUrls.json();

  const randomKey = randomObj(places[0]);
  const answer = places[0][randomKey].toUpperCase();
  const puzzles = places[1][randomKey];
  const puzzle = puzzles[randomArr(puzzles)];
  const answerUrl = answerUrls[places[0][randomKey]].split(" ")[1];
  const urlArr = [];

  for (let i = 0; i < puzzle.length; i++) {
    const urlInt = randomArr(urls[puzzle[i]]);
    const url = urls[puzzle[i]][urlInt].split(" ")[1];
    urlArr.push(url);

    localStorage.setItem("urlsPlaces", JSON.stringify(urlArr));
    localStorage.setItem("inputsPlaces", JSON.stringify(puzzle));
    localStorage.setItem("answerPlaces", answer);
    localStorage.setItem("answerUrlPlaces", answerUrl);
  }
  window.location.reload();
}

function randomArr(arr) {
  return Math.floor(Math.random() * arr.length);
}

function randomObj(obj) {
  return Math.floor(Math.random() * Object.keys(obj).length);
}

/* ==================================================== */
/* PUZZLE BUILDER */
/* ==================================================== */

const overlay = document.querySelector(".overlay");
const answerContain = document.querySelector(".answer-contain");
const container = document.querySelector(".container");
const imgContain = document.querySelector(".img-contain");
const answerInput = document.createElement("input");
answerInput.placeholder = "Your Answer...";
answerInput.setAttribute("id", "answer");
answerInput.autocomplete = "off";

let imgsOverlay = "";
let textOverlay = "";
let imgText = "";
let checkBtn = "";
let score = 0;
let wins = "";
let imgTexts = [];
let localUrls = "";
let localAnswer = "";
let localInputs = "";
let localAnswerUrl = "";

function buildPuzzle() {
  if (localStorage.getItem("peoplePuzzle")) {
    localUrls = JSON.parse(localStorage.getItem("urlsPeople"));
    localInputs = JSON.parse(localStorage.getItem("inputsPeople"));
    localAnswer = localStorage.getItem("answerPeople");
    localAnswerUrl = localStorage.getItem("answerUrlPeople");
  }

  if (localStorage.getItem("placesPuzzle")) {
    localUrls = JSON.parse(localStorage.getItem("urlsPlaces"));
    localInputs = JSON.parse(localStorage.getItem("inputsPlaces"));
    localAnswer = localStorage.getItem("answerPlaces");
    localAnswerUrl = localStorage.getItem("answerUrlPlaces");
  }

  for (let i = 0; i < localInputs.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    const inputContain = document.createElement("div");
    inputContain.classList.add("input-contain");

    const imgs = document.createElement("img");
    imgs.classList.add("imgs");

    imgText = document.createElement("input");
    imgText.classList.add("imgs-text");
    imgText.placeholder = "Guess...";
    imgText.style.textTransform = "uppercase";
    imgText.style.textAlign = "center";
    imgText.onkeyup = "/[A-Za-z]+$/";
    imgText.id = `input-${i}`;
    imgTexts.push(imgText);

    const url = localUrls[i];

    imgs.src = url;
    imgContain.appendChild(card);
    card.appendChild(imgs);
    imgContain.appendChild(inputContain);

    inputContain.appendChild(imgText);

    imgText.addEventListener("blur", evaluatePuzzle);
    imgText.addEventListener("keydown", checkKeyPress);
    imgText.addEventListener("blur", unfocusInput);
    imgText.addEventListener("focus", focusInput);
    answerInput.addEventListener("blur", checkAnswer);
    answerInput.addEventListener("keydown", checkKeyPress);
    answerInput.addEventListener("blur", unfocusAnswerInput);
    answerInput.addEventListener("focus", focusAnswerInput);
    giveUpBtn.addEventListener("click", () => {
      giveUp();
      helpBtn.style.backgroundColor = "rgb(168, 168, 168)";
      helpBtnClose.style.backgroundColor = "rgb(168, 168, 168)";
    });

    imgs.addEventListener("click", () => {
      overlay.classList.remove("card-toggle");

      textOverlay = document.createElement("a");
      textOverlay.classList.add("text-overlay");
      imgsOverlay = document.createElement("img");
      imgsOverlay.classList.add("imgs-overlay");

      textOverlay.textContent = `Source: ${url}`;
      textOverlay.href = url;
      textOverlay.target = "_blank";
      imgsOverlay.src = url;
      overlay.appendChild(textOverlay);
      overlay.appendChild(imgsOverlay);
    });

    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // Mobile View
      imgContain.style.gridTemplateRows = `repeat(${localInputs.length}, 1fr)`;
      inputContain.style.gridColumn = `2`;

      if (localInputs.length < 4) {
        container.style.maxWidth = "160rem";
        imgs.style.maxWidth = "15rem";
        imgs.style.height = "15rem";
        imgContain.style.paddingTop = "6.4rem";
      }
    } else {
      // Desktop View
      imgContain.style.gridTemplateColumns = `repeat(${localInputs.length}, 1fr)`;
      inputContain.style.gridRow = `2`;

      if (localInputs.length > 3) {
        container.style.maxWidth = "160rem";
      }
    }

    overlay.addEventListener("click", () => {
      overlay.classList.add("card-toggle");
      textOverlay.style.display = "none";
      imgsOverlay.style.display = "none";
    });

    answerInput.style.textTransform = "uppercase";
    answerInput.style.textAlign = "center";
    answerContain.appendChild(answerInput);
    answerContain.appendChild(giveUpBtn);
  }
}

/* ==================================================== */
/* HELP */
/* ==================================================== */

const helpBtn = document.querySelector(".help-btn");
const helpBtnClose = document.querySelector(".help-btn--close");
const helpMenu = document.querySelector(".help-menu");
const helpContain = document.querySelector(".help-contain");

helpBtn.addEventListener("click", () => {
  helpContain.classList.add("menu-open");
  helpBtn.style.display = "none";
  helpBtnClose.style.display = "block";
});

helpBtnClose.addEventListener("click", () => {
  helpContain.classList.remove("menu-open");
  helpBtn.style.display = "block";
  helpBtnClose.style.display = "none";
});

/* ==================================================== */
/* TUTORIAL */
/* ==================================================== */

const overlayTutorial = document.querySelector(".overlay-tutorial");
const tutorialBtn = document.querySelector(".tutorial-btn");

tutorialBtn.addEventListener("click", () => {
  helpContain.classList.remove("menu-open");
  helpBtn.style.display = "block";
  helpBtnClose.style.display = "none";
});

tutorialBtn.addEventListener("click", () => {
  overlayTutorial.classList.remove("tutorial-toggle");
  tutorialFirstPage();
});

function leaveTutorial() {
  const overlayExitBtn = document.createElement("button");
  overlayExitBtn.textContent = "Skip Tutorial";
  overlayExitBtn.classList.add("overlay-exit-btn");
  overlayExitBtn.addEventListener("click", () => {
    overlayTutorial.classList.add("tutorial-toggle");
    localStorage.setItem("tutorial", "true");
  });

  overlayTutorial.appendChild(overlayExitBtn);
}

function tutorialFirstPage() {
  const container = document.createElement("div");
  container.classList.add("page--container");

  // Populates the page to introduce the game and go to an example
  const heading = document.createElement("h1");
  heading.classList.add("tutorial-heading");
  const subheading = document.createElement("h3");
  subheading.classList.add("tutorial-subheading");
  const exampleText = document.createElement("p");
  exampleText.classList.add("tutorial-example-text");
  const exampleBtnContain = document.createElement("div");
  exampleBtnContain.classList.add("tutorial-example-btn-contain");
  const exampleBtn = document.createElement("button");
  exampleBtn.classList.add("tutorial-example-btn");
  heading.textContent = "Welcome to AddThePics!";
  subheading.textContent = "So... How does it work?";
  exampleText.textContent = "Let's explain it with an example!";
  exampleBtn.textContent = "Example";

  overlayTutorial.textContent = "";

  overlayTutorial.appendChild(container);
  container.appendChild(heading);
  container.appendChild(subheading);
  container.appendChild(exampleText);
  container.appendChild(exampleBtnContain);
  exampleBtnContain.appendChild(exampleBtn);

  // Goes to the second page of the tutorial
  exampleBtn.addEventListener("click", tutorialSecondPagePictures);

  leaveTutorial();
}

let tutorialAnswer = "";
let tutorialPuzzle = "";
let tutorialUrlArr = [];
let tutorialUrls = "";

async function tutorialSecondPagePictures() {
  overlayTutorial.textContent = "";

  const tutorialImgContain = document.createElement("div");
  tutorialImgContain.classList.add("tutorial-img-contain");

  const fileUrl = "./urls.json";

  const requestUrl = new Request(fileUrl);

  const responseUrl = await fetch(requestUrl);

  tutorialUrls = await responseUrl.json();

  tutorialAnswer = "MIKE TYSON";
  tutorialPuzzle = ["mic", "tie", "sun"];
  tutorialUrlArr = [];

  for (let i = 0; i < tutorialPuzzle.length; i++) {
    const url = tutorialUrls[tutorialPuzzle[i]][0].split(" ")[1];
    tutorialUrlArr.push(url);
  }

  const subheading = document.createElement("h3");
  subheading.classList.add("second-tutorial-subheading");
  subheading.textContent = "This is the puzzle:";

  const exampleBtnContain = document.createElement("div");
  exampleBtnContain.classList.add("tutorial-example-btn-contain");
  const exampleBtn = document.createElement("button");
  exampleBtn.classList.add("tutorial-example-btn");
  exampleBtn.textContent = "Okay...";

  for (let i = 0; i < tutorialPuzzle.length; i++) {
    const card = document.createElement("div");

    card.classList.add("card");
    const imgs = document.createElement("img");
    imgs.classList.add("imgs");

    const url = tutorialUrlArr[i];

    imgs.src = url;

    overlayTutorial.appendChild(subheading);
    overlayTutorial.appendChild(tutorialImgContain);
    tutorialImgContain.appendChild(card);
    card.appendChild(imgs);
    overlayTutorial.appendChild(exampleBtnContain);
    exampleBtnContain.appendChild(exampleBtn);
  }

  exampleBtn.addEventListener("click", tutorialSecondPageAnswers);
}

function tutorialSecondPageAnswers() {
  overlayTutorial.textContent = "";

  const tutorialImgContain = document.createElement("div");
  tutorialImgContain.classList.add("tutorial-img-contain");

  for (let i = 0; i < tutorialPuzzle.length; i++) {
    const url = tutorialUrls[tutorialPuzzle[i]][1].split(" ")[1];
    tutorialUrlArr.push(url);
  }

  const subheading = document.createElement("h3");
  subheading.classList.add("third-tutorial-subheading");
  subheading.textContent = "These are the answers:";

  const exampleBtnContain = document.createElement("div");
  exampleBtnContain.classList.add("tutorial-example-btn-contain");
  const exampleBtn = document.createElement("button");
  exampleBtn.classList.add("tutorial-example-btn");
  exampleBtn.textContent = "Okay!";

  for (let i = 0; i < tutorialPuzzle.length; i++) {
    const card = document.createElement("div");

    card.classList.add("card");
    const imgs = document.createElement("img");
    imgs.classList.add("imgs");

    const url = tutorialUrlArr[i];

    imgs.src = url;

    const imgText = document.createElement("input");
    imgText.classList.add("imgs-text");
    imgText.style.textTransform = "uppercase";
    imgText.style.textAlign = "center";
    imgText.disabled = true;
    imgText.style.backgroundColor = "rgba(0, 178, 178, 0.3)";
    imgText.style.borderBottom = "transparent";
    imgText.style.color = "black";
    imgText.id = `input-${i}`;
    imgText.value = tutorialPuzzle[i];

    overlayTutorial.appendChild(tutorialImgContain);
    overlayTutorial.appendChild(subheading);
    tutorialImgContain.appendChild(card);
    card.appendChild(imgs);
    tutorialImgContain.appendChild(imgText);
  }

  const answerContain = document.createElement("div");
  answerContain.classList.add("tutorial-answer-contain");
  const answer = document.createElement("input");
  answer.classList.add("tutorial-answer");
  answer.style.textTransform = "uppercase";
  answer.style.textAlign = "center";
  answer.disabled = true;
  answer.style.backgroundColor = "rgba(0, 178, 178, 0.3)";
  answer.style.borderBottom = "transparent";
  answer.style.color = "black";
  imgText.style;
  answer.value = tutorialAnswer;

  overlayTutorial.appendChild(answerContain);
  answerContain.appendChild(answer);
  overlayTutorial.appendChild(exampleBtnContain);
  exampleBtnContain.appendChild(exampleBtn);

  exampleBtn.addEventListener("click", tutorialThirdPage);
}

function tutorialThirdPage() {
  const container = document.createElement("div");
  container.classList.add("page--container");

  // Populates the page to introduce the game and go to an example
  const subheading = document.createElement("h3");
  subheading.classList.add("third-page-tutorial-subheading");
  const exampleText = document.createElement("p");
  exampleText.classList.add("third-page-tutorial-example-text");
  const exampleBtnContain = document.createElement("div");
  exampleBtnContain.classList.add("tutorial-example-btn-contain");
  const exampleBtn = document.createElement("button");
  exampleBtn.classList.add("tutorial-example-btn");
  subheading.textContent =
    "And that's it! Just guess the name from the pictures!";
  exampleText.textContent = `50% points for the pictures' words. 50% for the full answer. Let's try a harder one...`;
  exampleBtn.textContent = "Harder Example";

  overlayTutorial.textContent = "";

  overlayTutorial.appendChild(container);
  container.appendChild(subheading);
  container.appendChild(exampleText);
  container.appendChild(exampleBtnContain);
  exampleBtnContain.appendChild(exampleBtn);

  exampleBtn.addEventListener("click", tutorialFourthPagePictures);
}

async function tutorialFourthPagePictures() {
  overlayTutorial.textContent = "";

  const tutorialImgContain = document.createElement("div");
  tutorialImgContain.classList.add("fourth-page-tutorial-img-contain");

  const fileUrl = "./urls.json";

  const requestUrl = new Request(fileUrl);

  const responseUrl = await fetch(requestUrl);

  tutorialUrls = await responseUrl.json();

  tutorialAnswer = "MICHAEL JACKSON";
  tutorialPuzzle = ["mic", "ale", "jack", "sun"];
  tutorialUrlArr = [];

  for (let i = 0; i < tutorialPuzzle.length; i++) {
    const url = tutorialUrls[tutorialPuzzle[i]][0].split(" ")[1];
    tutorialUrlArr.push(url);
  }

  const subheadingPuzzle = document.createElement("h3");
  subheadingPuzzle.classList.add("fourth-page-tutorial-subheading");
  subheadingPuzzle.textContent = "This is the puzzle:";

  const exampleBtnContain = document.createElement("div");
  exampleBtnContain.classList.add("tutorial-example-btn-contain");
  const exampleBtn = document.createElement("button");
  exampleBtn.classList.add("tutorial-example-btn");
  exampleBtn.textContent = "Okay...";

  for (let i = 0; i < tutorialPuzzle.length; i++) {
    const card = document.createElement("div");

    card.classList.add("card");
    const imgs = document.createElement("img");
    imgs.classList.add("tutorial-imgs");

    const url = tutorialUrlArr[i];

    imgs.src = url;

    overlayTutorial.appendChild(subheadingPuzzle);
    overlayTutorial.appendChild(tutorialImgContain);
    tutorialImgContain.appendChild(card);
    card.appendChild(imgs);
    overlayTutorial.appendChild(exampleBtnContain);
    exampleBtnContain.appendChild(exampleBtn);
  }

  exampleBtn.addEventListener("click", tutorialFourthPageAnswers);
}

function tutorialFourthPageAnswers() {
  overlayTutorial.textContent = "";

  const tutorialImgContain = document.createElement("div");
  tutorialImgContain.classList.add("fourth-page-tutorial-img-contain");

  for (let i = 0; i < tutorialPuzzle.length; i++) {
    const url = tutorialUrls[tutorialPuzzle[i]][1].split(" ")[1];
    tutorialUrlArr.push(url);
  }

  const subheadingAnswer = document.createElement("h3");
  subheadingAnswer.classList.add("fourth-page-answer-tutorial-subheading");
  subheadingAnswer.textContent = "These are the answers:";

  const exampleBtnContain = document.createElement("div");
  exampleBtnContain.classList.add("tutorial-example-btn-contain");
  const exampleBtn = document.createElement("button");
  exampleBtn.classList.add("tutorial-example-btn");
  exampleBtn.textContent = "Okay!";

  for (let i = 0; i < tutorialPuzzle.length; i++) {
    const card = document.createElement("div");

    card.classList.add("card");
    const imgs = document.createElement("img");
    imgs.classList.add("tutorial-imgs");

    const url = tutorialUrlArr[i];

    imgs.src = url;

    const imgText = document.createElement("input");
    imgText.classList.add("imgs-text");
    imgText.style.textTransform = "uppercase";
    imgText.style.textAlign = "center";
    imgText.disabled = true;
    imgText.style.backgroundColor = "rgba(0, 178, 178, 0.3)";
    imgText.style.borderBottom = "transparent";
    imgText.style.color = "black";
    imgText.id = `input-${i}`;
    imgText.value = tutorialPuzzle[i];

    overlayTutorial.appendChild(tutorialImgContain);
    tutorialImgContain.appendChild(card);
    card.appendChild(imgs);
    tutorialImgContain.appendChild(imgText);
  }

  const answerContain = document.createElement("div");
  answerContain.classList.add("tutorial-answer-contain");
  const answer = document.createElement("input");
  answer.classList.add("tutorial-answer");
  answer.style.textTransform = "uppercase";
  answer.style.textAlign = "center";
  answer.disabled = true;
  answer.style.backgroundColor = "rgba(0, 178, 178, 0.3)";
  answer.style.borderBottom = "transparent";
  answer.style.color = "black";
  imgText.style;
  answer.value = tutorialAnswer;

  overlayTutorial.appendChild(subheadingAnswer);
  overlayTutorial.appendChild(answerContain);
  answerContain.appendChild(answer);
  overlayTutorial.appendChild(exampleBtnContain);
  exampleBtnContain.appendChild(exampleBtn);

  exampleBtn.addEventListener("click", tutorialFifthPage);
}

function tutorialFifthPage() {
  const container = document.createElement("div");
  container.classList.add("page--container");

  // Populates the page to introduce the game and go to an example
  const subheading = document.createElement("h3");
  subheading.classList.add("third-page-tutorial-subheading");
  const exampleText = document.createElement("p");
  exampleText.classList.add("third-page-tutorial-example-text");
  const exampleBtnContain = document.createElement("div");
  exampleBtnContain.classList.add("tutorial-example-btn-contain");
  const exampleBtn = document.createElement("button");
  exampleBtn.classList.add("tutorial-example-btn");
  subheading.textContent = "And Don't worry if you're not quite sure.";
  exampleText.textContent = `You can always just press "give up" and get the answer!`;
  exampleBtn.textContent = "Finish";

  overlayTutorial.textContent = "";

  overlayTutorial.appendChild(container);
  container.appendChild(subheading);
  container.appendChild(exampleText);
  container.appendChild(exampleBtnContain);
  exampleBtnContain.appendChild(exampleBtn);

  exampleBtn.addEventListener("click", () => {
    overlayTutorial.classList.add("tutorial-toggle");
    localStorage.setItem("tutorial", "true");
  });
}

/* ==================================================== */
/* TIPS */
/* ==================================================== */
const tipsBtn = document.querySelector(".tips-btn");
const tipsDisplay = document.querySelector(".tips-display");
const tipsContain = document.querySelector(".tips-contain");

function showTips() {
  const tips = document.createElement("p");
  tips.classList.add("tips");
  tips.setAttribute("style", "white-space: pre-line;");

  tips.textContent =
    "The pictures' words may not sound exactly the same as the full answer, and it can depend on accent. \r\n\n";
  tips.textContent +=
    "The more you play, the more you'll remember certain pictures' words - practice makes perfect! \r\n\n";
  tips.textContent +=
    'When it says "close", this only indicates close spelling, not meaning. So if the answer is "MAD", and you type "ANGRY", it won\'t say "close", even though it has a similar meaning. \r\n\n';
  tips.textContent +=
    "There are many awesome words that you've never heard of - take note of words you're unfamiliar with and expand your vocabulary! We certainly learnt a few making this game.";

  const closeTips = document.createElement("button");
  closeTips.classList.add("close-tips");
  closeTips.textContent = "X";

  tipsDisplay.appendChild(tips);
  tipsDisplay.appendChild(closeTips);

  closeTips.addEventListener("click", () => {
    tipsContain.classList.remove("tips-open");

    setTimeout(() => {
      tips.textContent = "";
    }, 900);
  });

  if (tips.textContent != "") {
    helpBtn.addEventListener("click", () => {
      tipsContain.classList.remove("tips-open");

      setTimeout(() => {
        tips.textContent = "";
      }, 900);
    });
  }
}

tipsBtn.addEventListener("click", () => {
  tipsContain.classList.add("tips-open");
  helpContain.classList.remove("menu-open");
  helpBtn.style.display = "block";
  helpBtnClose.style.display = "none";
  showTips();
});

/* ==================================================== */
/* FUNCTIONS FOR THE INPUTS */
/* ==================================================== */

function checkAnswer(e) {
  const answerImg = document.createElement("img");
  answerImg.classList.add("answer-img");

  let key = e.target.value.toUpperCase();
  let simi = stringSimilarity.compareTwoStrings(key, localAnswer);
  key = key.split(" ");

  for (let i = 0; i < key.length; i++) {
    if (key[i] === "") {
      key.splice(i, 1);
      i--;
    }
  }

  key = key.join(" ");
  answerInput.value = key;

  if (answerInput.value === "") {
    answerInput.value = "";
  } else if (key === localAnswer) {
    answerInput.style.backgroundColor = "#3dcc42";
    answerInput.disabled = true;
    answerInput.style.color = "black";
    answerInput.style.borderBottom = "none";

    let answerInputScore = 50;
    score += answerInputScore;
    if (scoreNum.textContent === "0") {
      scoreNum.textContent = "";
    }
    scoreNum.textContent = Math.round(score);

    if (Math.round(score) === 100) {
      let wins = parseInt(localStorage.getItem("wins"));
      localStorage.setItem("wins", ++wins);
      winsNum.textContent = wins;

      document.body.style.backgroundColor = "#8bc48d";
      helpBtn.style.backgroundColor = "#8bc48d";
      helpBtnClose.style.backgroundColor = "#8bc48d";
      scoreOutline.style.border = "3px solid #14911d";
      scoreOutline.style.borderTop = "none";

      answerImg.src = localAnswerUrl;
      answerContain.appendChild(answerImg);

      answerContain.appendChild(nextBtn);
      giveUpBtn.replaceWith(nextBtn);
    }

    answerImg.addEventListener("click", () => {
      overlay.classList.remove("card-toggle");

      textOverlay = document.createElement("a");
      textOverlay.classList.add("text-overlay");
      imgsOverlay = document.createElement("img");
      imgsOverlay.classList.add("imgs-overlay");

      textOverlay.textContent = `Source: ${localAnswerUrl}`;
      textOverlay.href = localAnswerUrl;
      textOverlay.target = "_blank";
      imgsOverlay.src = localAnswerUrl;
      overlay.appendChild(textOverlay);
      overlay.appendChild(imgsOverlay);
    });
  } else if (simi >= Math.min(0.7, localAnswer.length * 0.1875)) {
    answerInput.value = `${key} - close!`;
    answerInput.blur();
  } else {
    answerInput.value = "nope... try again!";
    answerInput.style.color = "#de2f2f";
    answerInput.blur();
  }
}

function evaluatePuzzle(e) {
  const answerImg = document.createElement("img");
  answerImg.classList.add("answer-img");

  let position = e.target.id.split("-")[1];
  let key = e.target.value.toLowerCase().trim();
  let simi = stringSimilarity.compareTwoStrings(key, localInputs[position]);

  if (imgTexts[position].value === "") {
    imgTexts[position].value = "";
  } else if (key === localInputs[position]) {
    imgTexts[position].style.backgroundColor = "#3dcc42";
    imgTexts[position].disabled = true;
    imgTexts[position].style.color = "black";
    imgTexts[position].style.borderBottom = "none";

    let imgTextsScore = 50 / localInputs.length;
    score += imgTextsScore;
    if (scoreNum.textContent === "0") {
      scoreNum.textContent = "";
    }

    scoreNum.textContent = Math.round(score);

    if (Math.round(score) === 100) {
      let wins = parseInt(localStorage.getItem("wins"));
      localStorage.setItem("wins", ++wins);
      winsNum.textContent = wins;

      document.body.style.backgroundColor = "#8bc48d";
      helpBtn.style.backgroundColor = "#8bc48d";
      helpBtnClose.style.backgroundColor = "#8bc48d";
      scoreOutline.style.border = "3px solid #14911d";
      scoreOutline.style.borderTop = "none";

      answerImg.src = localAnswerUrl;
      answerContain.appendChild(answerImg);

      answerContain.appendChild(nextBtn);
      giveUpBtn.replaceWith(nextBtn);
    }
  } else if (simi >= Math.min(0.7, localInputs[position].length * 0.1875)) {
    imgTexts[position].value = `${key} - close!`;
    imgTexts[position].blur();
  } else {
    imgTexts[position].value = "nope... try again!";
    imgTexts[position].style.color = "#de2f2f";
    imgTexts[position].blur();
  }

  if (key === "") {
    imgTexts[position].style.backgroundColor = "rgba(0, 178, 178, 0.3)";
  }
}

function checkKeyPress(e) {
  if (e.key === "Enter") {
    let i = parseInt(this.id.charAt(this.id.length - 1));
    i++;

    if (i < imgTexts.length) {
      document.getElementById(`input-${i - 1}`).blur();
      document.getElementById(`input-${i}`).focus();
    } else if (i === imgTexts.length) {
      document.getElementById(`input-${i - 1}`).blur();
      answerInput.focus();
    } else {
      console.log(isNaN(i));
      answerInput.blur();
    }
  }
}

// Linked to wins, this allows the wins to display permanately
let winsDisplay = localStorage.getItem("wins");
winsNum.textContent = winsDisplay;

function focusInput(e) {
  let position = e.target.id.split("-")[1];
  let key = e.target.value.toLowerCase().trim();

  if (key !== localInputs[position]) {
    imgTexts[position].style.backgroundColor = "rgba(0, 178, 178, 0.3)";
  }

  if (imgTexts[position].value.endsWith(" - close!")) {
    imgTexts[position].value = imgTexts[position].value.split(" - close!")[0];
  } else if (imgTexts[position].value === "nope... try again!") {
    imgTexts[position].value = "";
    imgTexts[position].style.color = "black";
  }
}

function unfocusInput(e) {
  let position = e.target.id.split("-")[1];
  let key = e.target.value.toLowerCase().trim();

  if (key !== localInputs[position]) {
    imgTexts[position].style.backgroundColor = "transparent";
    imgTexts[position].style.borderBottom = "2px solid var(--clr-cyan);";
  }

  if (imgTexts[position].disabled === true) {
    imgTexts[position].style.borderBottom = "transparent";
  }

  imgTexts[position].value = key;
}

function focusAnswerInput(e) {
  let key = e.target.value.toUpperCase();

  if (key !== localAnswer) {
    answerInput.style.backgroundColor = "rgba(0, 178, 178, 0.3)";
  }

  if (answerInput.value.endsWith(" - close!")) {
    answerInput.value = answerInput.value.split(" - close!")[0];
  } else if (answerInput.value === "nope... try again!") {
    answerInput.value = "";
    answerInput.style.color = "black";
  }
}

function unfocusAnswerInput(e) {
  let key = e.target.value.toUpperCase();

  if (key !== localAnswer) {
    answerInput.style.backgroundColor = "transparent";
    answerInput.style.borderBottom = "2px solid var(--clr-cyan);";
  }

  if (answerInput.disabled === true) {
    answerInput.style.borderBottom = "transparent";
  }
}

/* ==================================================== */
/* GIVE UP FUNCTION */
/* ==================================================== */

const giveUpBtn = document.createElement("button");
giveUpBtn.textContent = "Give Up";
giveUpBtn.classList.add("give-up-btn");
const nextBtn = document.createElement("button");
nextBtn.textContent = "Next Puzzle";
nextBtn.classList.add("next-btn");

function giveUp() {
  const answerImg = document.createElement("img");
  answerImg.src = localAnswerUrl;

  for (let i = 0; i < imgTexts.length; i++) {
    setTimeout(() => {
      imgTexts[i].value = localInputs[i];
      imgTexts[i].disabled = true;

      imgTexts[i].style.backgroundColor = "#00b2b2";
      imgTexts[i].style.color = "black";
      imgTexts[i].style.borderRadius = "4px";
    }, 800 * i);
  }

  setTimeout(() => {
    answerInput.value = localAnswer;
    answerInput.disabled = true;
    answerInput.style.backgroundColor = "#00b2b2";
    answerInput.style.color = "black";
    answerInput.style.borderRadius = "4px";
    answerContain.appendChild(nextBtn);
    giveUpBtn.replaceWith(nextBtn);

    answerImg.classList.add("answer-img");
    answerContain.appendChild(answerImg);

    answerImg.addEventListener("click", () => {
      overlay.classList.remove("card-toggle");

      textOverlay = document.createElement("a");
      textOverlay.classList.add("text-overlay");
      imgsOverlay = document.createElement("img");
      imgsOverlay.classList.add("imgs-overlay");

      textOverlay.textContent = `Source: ${localAnswerUrl}`;
      textOverlay.href = localAnswerUrl;
      textOverlay.target = "_blank";
      imgsOverlay.src = localAnswerUrl;
      overlay.appendChild(textOverlay);
      overlay.appendChild(imgsOverlay);
    });
  }, 800 * imgTexts.length + 300);

  document.body.style.backgroundColor = "rgb(168, 168, 168)";

  if (scoreNum.textContent === "0") {
    scoreNum.textContent = "";
  }
  scoreNum.textContent = Math.floor(score);
}

/* ==================================================== */
/* CATEGORIES */
/* ==================================================== */

const people = document.querySelector(".people");
const places = document.querySelector(".places");

people.addEventListener("click", () => {
  localStorage.setItem("peoplePuzzle", "true");

  localStorage.removeItem("placesPuzzle");
  localStorage.removeItem("categoryPlacesBtn");

  if (!localStorage.getItem("categoryPeopleBtn")) {
    localStorage.setItem("categoryPeopleBtn", "true");
    window.location.reload();
  }
});

if (localStorage.getItem("peoplePuzzle")) {
  people.style.border = "2px solid #00b2b2";
  buildPuzzle();
}

places.addEventListener("click", () => {
  localStorage.setItem("placesPuzzle", "true");

  localStorage.removeItem("peoplePuzzle");
  localStorage.removeItem("categoryPeopleBtn");

  if (!localStorage.getItem("categoryPlacesBtn")) {
    localStorage.setItem("categoryPlacesBtn", "true");
    window.location.reload();
  }
});

if (localStorage.getItem("placesPuzzle")) {
  places.style.border = "2px solid #00b2b2";
  buildPuzzle();
}

/* ==================================================== */
/* INITIAL LOAD AND NEXT BUTTON */
/* ==================================================== */

if (!localStorage.getItem("initialLoad")) {
  getPuzzlePeople();
  getPuzzlePlaces();

  localStorage.setItem("peoplePuzzle", "true");
  localStorage.setItem("initialLoad", "true");

  localStorage.setItem("initialLoad", "true");
  localStorage.setItem("wins", "0");
}

if (!localStorage.getItem("tutorial")) {
  overlayTutorial.classList.remove("tutorial-toggle");
  tutorialFirstPage();
}

nextBtn.addEventListener("click", () => {
  if (localStorage.getItem("peoplePuzzle")) {
    getPuzzlePeople();
  }

  if (localStorage.getItem("placesPuzzle")) {
    getPuzzlePlaces();
  }
});

// localStorage.removeItem("tutorial");
// localStorage.removeItem("initialLoad");
// localStorage.removeItem("peoplePuzzle");
// localStorage.removeItem("categoryPeoplePuzzle");
