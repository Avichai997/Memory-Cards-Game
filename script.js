const cardsContainer = document.getElementsByClassName("cards")[0],
  timeTag = document.querySelector(".time b"),
  flipsTag = document.querySelector(".flips b"),
  mistakesTag = document.querySelector(".mistakes b"),
  matchedTag = document.querySelector(".matched b"),
  refreshBtn = document.querySelector(".details button"),
  dialog = document.getElementById("gameDialog"),
  playerInfoForm = document.getElementById("playerInfoForm"),
  playerNameInput = document.querySelector("#playerNameInput"),
  cardsNumberInput = document.querySelector("#cardsNumberInput");

let playerName = 0;
let playerCardsNumber = 30;
let timeLeft = 0;
let flips = 0;
let mistakes = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;

const createCard = (index) => {
  return `<div class="card">
        <div class="view front-view">
          <img src="images/que_icon.svg"/>
        </div>
        <div class="view back-view">
          <img src="images/gem-${index}.png"/>
        </div>
      </div>`;
};

playerInfoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  playerName = playerNameInput.value.trim();
  playerCardsNumber = +cardsNumberInput.value;
  if (playerName === "") return alert(`Player name can't be empty!`);

  document.getElementById("playerName").textContent = playerName;
  document.getElementById("cardsNumber").textContent = playerCardsNumber;
  shuffleCard();
  dialog.close();
});

function initTimer() {
  if (timeLeft <= 0) return clearInterval(timer);

  timeTag.innerText = --timeLeft;
}

function flipCard({ target: clickedCard }) {
  if (!isPlaying) {
    isPlaying = true;
    timer = setInterval(initTimer, 1000);
  }
  if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
    flips++;
    flipsTag.innerText = flips;
    clickedCard.classList.add("flip");
    if (!cardOne) return (cardOne = clickedCard);

    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src,
      cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
  } else if (timeLeft <= 0) {
    alert("Game over !");
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    matchedCard++;
    matchedTag.innerText = matchedCard;
    // win !
    if (matchedCard === playerCardsNumber / 2) {
      alert("you win!");
      return clearInterval(timer);
    }

    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return (disableDeck = false);
  }

  // cards are not the same
  mistakes++;
  mistakesTag.innerText = mistakes;

  setTimeout(() => {
    cardOne.classList.add("shake");
    cardTwo.classList.add("shake");
  }, 400);

  setTimeout(() => {
    cardOne.classList.remove("shake", "flip");
    cardTwo.classList.remove("shake", "flip");
    cardOne = cardTwo = "";
    disableDeck = false;
  }, 1200);
}

function shuffleCard() {
  // 1) reset variables
  flips = matchedCard = flips = mistakes = 0;
  timeLeft = playerCardsNumber * 2.5;
  cardOne = cardTwo = "";
  clearInterval(timer);
  timeTag.innerText = timeLeft;
  flipsTag.innerText = flips;
  mistakesTag.innerText = mistakes;
  matchedTag.innerText = matchedCard;
  disableDeck = isPlaying = false;

  // 2) create cards
  cardsContainer.innerHTML = "";
  for (let i = 1; i <= playerCardsNumber; i++)
    cardsContainer.insertAdjacentHTML("beforeend", createCard(i));

  // 3) shuffle cards
  let arr = [];
  for (let i = 1; i <= playerCardsNumber / 2; i++) arr.push(i);
  for (let i = 1; i <= playerCardsNumber / 2; i++) arr.push(i);

  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    setTimeout(() => {
      imgTag.src = `images/gem-${arr[index]}.png`;
    }, 500);
    card.addEventListener("click", flipCard);
  });
}

refreshBtn.addEventListener("click", () => dialog.showModal());

// dialog.showModal();
