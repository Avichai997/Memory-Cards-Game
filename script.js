const cards = document.querySelectorAll(".card"),
  timeTag = document.querySelector(".time b"),
  flipsTag = document.querySelector(".flips b"),
  refreshBtn = document.querySelector(".details button");

let playTime = 0;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;

function initTimer() {
//   if (playTime >= 0) {
//     return clearInterval(timer);
//   }
  playTime++;
  timeTag.innerText = playTime;
}

function flipCard({ target: clickedCard }) {
  if (!isPlaying) {
    isPlaying = true;
    timer = setInterval(initTimer, 1000);
  }
  if (clickedCard !== cardOne && !disableDeck) {
    flips++;
    flipsTag.innerText = flips;
    clickedCard.classList.add("flip");
    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src,
      cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
  }
}

function matchCards(img1, img2) {
  if (img1 === img2) {
    matchedCard++;
    if (matchedCard == 6) {
      return clearInterval(timer);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    return (disableDeck = false);
  }

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
  flips = matchedCard = 0;
  cardOne = cardTwo = "";
  clearInterval(timer);
  timeTag.innerText = playTime;
  flipsTag.innerText = flips;
  disableDeck = isPlaying = false;

  let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  cards.forEach((card, index) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    setTimeout(() => {
      imgTag.src = `images/img-${arr[index]}.png`;
    }, 500);
    card.addEventListener("click", flipCard);
  });
}

shuffleCard();

refreshBtn.addEventListener("click", shuffleCard);

cards.forEach((card) => {
  card.addEventListener("click", flipCard);
});
