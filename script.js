const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbypKLEGaQbn6TgooTIRCDq3YMt2lMoSv45UbTbTGwVZUyE7p2FGXkxFPs_RjkUe8WweYQ/exec";

const welcomeScreen = document.getElementById("welcomeScreen");
const wishScreen = document.getElementById("wishScreen");
const spinScreen = document.getElementById("spinScreen");

const visitorNameInput = document.getElementById("visitorName");
const bkashNumberInput = document.getElementById("bkashNumber");
const visitorWishInput = document.getElementById("visitorWish");

const nameError = document.getElementById("nameError");
const bkashError = document.getElementById("bkashError");
const wishError = document.getElementById("wishError");

const startBtn = document.getElementById("startBtn");
const goSpinBtn = document.getElementById("goSpinBtn");
const spinBtn = document.getElementById("spinBtn");

const wishTitle = document.getElementById("wishTitle");
const wishMessage = document.getElementById("wishMessage");

const slotMachine = document.getElementById("slotMachine");
const slotText = document.getElementById("slotText");

const resultBox = document.getElementById("resultBox");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");

const saveStatus = document.getElementById("saveStatus");

const actionButtons = document.getElementById("actionButtons");
const shareTextBtn = document.getElementById("shareTextBtn");
const downloadCardBtn = document.getElementById("downloadCardBtn");
const shareCardBtn = document.getElementById("shareCardBtn");
const replayBtn = document.getElementById("replayBtn");

const shareCardTitle = document.getElementById("shareCardTitle");
const shareCardMessage = document.getElementById("shareCardMessage");
const shareCardReward = document.getElementById("shareCardReward");
const shareCardFooter = document.getElementById("shareCardFooter");
const shareCardCapture = document.getElementById("shareCardCapture");

let visitorName = "";
let visitorBkash = "";
let visitorWish = "";
let finalReward = "";

const visualRewards = [
  "৳1 Eid Salami",
  "৳2 Eid Salami",
  "৳3 Eid Salami",
  "৳4 Eid Salami",
  "৳5 Eid Salami",
  "৳6 Eid Salami",
  "৳7 Eid Salami",
  "৳8 Eid Salami",
  "৳9 Eid Salami",
  "৳10 Eid Salami",

  "৳1 Eid Salami",
  "৳2 Eid Salami",
  "৳3 Eid Salami",
  "৳4 Eid Salami",
  "৳5 Eid Salami",
  "৳6 Eid Salami",
  "৳7 Eid Salami",
  "৳8 Eid Salami",
  "৳9 Eid Salami",
  "৳10 Eid Salami",

  "৳11 Eid Salami",
  "৳15 Eid Salami",
  "৳20 Eid Salami",
  "৳25 Eid Salami",
  "৳30 Eid Salami",

  "Unlimited Dua 🤲",
  "Chocolate Treat 🍫",
  "Big Eid Hug 🤗",
  "Premium Barakah Pack ✨",

  "৳100 Mega Salami"
];

startBtn.addEventListener("click", function () {
  const nameValue = visitorNameInput.value.trim();
  const bkashValue = bkashNumberInput.value.trim();

  let hasError = false;

  if (nameValue === "") {
    nameError.innerText = "Enter name.";
    hasError = true;
  } else if (nameValue.length < 2) {
    nameError.innerText = "Too short.";
    hasError = true;
  } else {
    nameError.innerText = "";
  }

  if (bkashValue === "") {
    bkashError.innerText = "Enter bKash.";
    hasError = true;
  } else if (!/^01[0-9]{9}$/.test(bkashValue)) {
    bkashError.innerText = "Invalid number.";
    hasError = true;
  } else {
    bkashError.innerText = "";
  }

  if (hasError) {
    return;
  }

  visitorName = nameValue;
  visitorBkash = bkashValue;

  wishTitle.innerText = `Eid Mubarak, ${visitorName} 🌙`;

  wishMessage.innerText =
    "May Allah fill your Eid with peace, barakah, good health, and quiet happiness. This is only a small Eid greeting from Zihad, made to share a smile.";

  showScreen(wishScreen);
  createFloatingItems(18);
});

visitorNameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    bkashNumberInput.focus();
  }
});

bkashNumberInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    startBtn.click();
  }
});

visitorWishInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    goSpinBtn.click();
  }
});

goSpinBtn.addEventListener("click", function () {
  const wishValue = visitorWishInput.value.trim();

  if (wishValue === "") {
    wishError.innerText = "Write a small wish.";
    visitorWishInput.focus();
    return;
  }

  if (wishValue.length < 5) {
    wishError.innerText = "Wish is too short.";
    visitorWishInput.focus();
    return;
  }

  wishError.innerText = "";
  visitorWish = wishValue;

  showScreen(spinScreen);
});

spinBtn.addEventListener("click", function () {
  spinBtn.disabled = true;
  spinBtn.innerText = "Spinning...";

  saveStatus.innerText = "";
  resultBox.classList.remove("show");
  actionButtons.classList.remove("show");
  slotMachine.classList.add("slot-running");

  let spinCount = 0;

  const spinInterval = setInterval(function () {
    const randomReward = visualRewards[Math.floor(Math.random() * visualRewards.length)];
    slotText.innerText = randomReward;
    spinCount++;

    if (spinCount >= 28) {
      clearInterval(spinInterval);
      requestRealRewardFromGoogleSheet();
    }
  }, 80);
});

shareTextBtn.addEventListener("click", function () {
  const wishText = createFinalWishText();

  if (navigator.share) {
    navigator.share({
      title: "Eid Mubarak",
      text: wishText
    }).catch(function () {});
  } else {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(wishText)}`;
    window.open(whatsappUrl, "_blank");
  }
});

downloadCardBtn.addEventListener("click", async function () {
  await downloadShareCard();
});

shareCardBtn.addEventListener("click", async function () {
  await shareCardImage();
});

replayBtn.addEventListener("click", function () {
  resetGame();
});

function requestRealRewardFromGoogleSheet() {
  if (GOOGLE_SCRIPT_URL === "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE") {
    slotMachine.classList.remove("slot-running");
    spinBtn.disabled = false;
    spinBtn.innerText = "Let’s Spin";
    saveStatus.innerText = "Google Apps Script URL missing.";
    return;
  }

  saveStatus.innerText = "Checking your Eid surprise...";

  const callbackName = "handleRewardResponse_" + Date.now();
  let script;

  window[callbackName] = function (data) {
    if (!data || data.status !== "success") {
      slotMachine.classList.remove("slot-running");
      spinBtn.disabled = false;
      spinBtn.innerText = "Let’s Spin";
      saveStatus.innerText = "Something went wrong. Please try again.";

      if (script) {
        script.remove();
      }

      delete window[callbackName];
      return;
    }

    finalReward = data.rewardText;
    slotText.innerText = finalReward;

    resultTitle.innerText = `Eid Mubarak, ${visitorName}! 🎉`;

    if (data.rewardType === "money") {
      resultMessage.innerText =
        `You got ${finalReward}. I will try to send it through bKash soon, in shaa Allah. Eid Mubarak!`;
    } else {
      resultMessage.innerText =
        `You got ${finalReward}. Sometimes the best Eid gift is a smile and a sincere dua.`;
    }

    updateShareCardContent(data.rewardType);

    resultBox.classList.add("show");
    actionButtons.classList.add("show");
    slotMachine.classList.remove("slot-running");

    spinBtn.innerText = "Spin Completed";
    saveStatus.innerText = "Your Eid surprise is ready.";

    createFloatingItems(30);

    if (script) {
      script.remove();
    }

    delete window[callbackName];
  };

  script = document.createElement("script");

  script.src =
    GOOGLE_SCRIPT_URL +
    "?callback=" + encodeURIComponent(callbackName) +
    "&visitorName=" + encodeURIComponent(visitorName) +
    "&bkashNumber=" + encodeURIComponent(visitorBkash) +
    "&visitorWish=" + encodeURIComponent(visitorWish) +
    "&deviceInfo=" + encodeURIComponent(navigator.userAgent) +
    "&pageUrl=" + encodeURIComponent(window.location.href) +
    "&t=" + Date.now();

  script.onerror = function () {
    slotMachine.classList.remove("slot-running");
    spinBtn.disabled = false;
    spinBtn.innerText = "Let’s Spin";
    saveStatus.innerText = "Network error. Try again.";

    script.remove();
    delete window[callbackName];
  };

  document.body.appendChild(script);
}

function updateShareCardContent(rewardType) {
  shareCardTitle.innerText = `Eid Mubarak, ${visitorName}! 🌙`;

  if (rewardType === "money") {
    shareCardMessage.innerText =
      "May Allah fill your Eid with peace, barakah, good health, and quiet happiness.";
  } else {
    shareCardMessage.innerText =
      "May Allah fill your Eid with peace, barakah, and gentle happiness. A small smile is also a beautiful Eid gift.";
  }

  shareCardReward.innerText = finalReward;
  shareCardFooter.innerText = "With duas,\nZihad";
}

async function generateShareCardBlob() {
  if (typeof html2canvas === "undefined") {
    alert("Card generator is not loaded. Check your internet connection.");
    return null;
  }

  try {
    const canvas = await html2canvas(shareCardCapture, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false
    });

    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) {
        resolve(blob);
      }, "image/png", 1);
    });
  } catch (error) {
    console.log("Card generation error:", error);
    alert("Could not create card image. Please try again.");
    return null;
  }
}

async function downloadShareCard() {
  const blob = await generateShareCardBlob();

  if (!blob) {
    return;
  }

  const fileName = `eid-wish-${visitorName || "card"}.png`;
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  setTimeout(function () {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 500);
}

async function shareCardImage() {
  const blob = await generateShareCardBlob();

  if (!blob) {
    return;
  }

  const file = new File([blob], `eid-wish-${visitorName || "card"}.png`, {
    type: "image/png"
  });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: "Eid Mubarak",
        text: "A small Eid wish 🌙",
        files: [file]
      });
    } catch (error) {
      console.log("Share cancelled or failed:", error);
    }
  } else {
    await downloadShareCard();
    alert("Direct image sharing is not supported on this browser. The card has been downloaded instead.");
  }
}

function showScreen(screenToShow) {
  welcomeScreen.classList.remove("active");
  wishScreen.classList.remove("active");
  spinScreen.classList.remove("active");

  screenToShow.classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function createFinalWishText() {
  return `Eid Mubarak, ${visitorName}! 🌙

May Allah fill your Eid with peace, barakah, good health, and quiet happiness.

Your Eid surprise: ${finalReward}

With duas,
Zihad`;
}

function resetGame() {
  visitorName = "";
  visitorBkash = "";
  visitorWish = "";
  finalReward = "";

  visitorNameInput.value = "";
  bkashNumberInput.value = "";
  visitorWishInput.value = "";

  nameError.innerText = "";
  bkashError.innerText = "";
  wishError.innerText = "";
  saveStatus.innerText = "";

  slotText.innerText = "৳---";

  spinBtn.disabled = false;
  spinBtn.innerText = "Let’s Spin";

  resultBox.classList.remove("show");
  actionButtons.classList.remove("show");
  slotMachine.classList.remove("slot-running");

  showScreen(welcomeScreen);
}

function createFloatingItems(amount) {
  const items = ["✨", "🌙", "🎁", "⭐", "🤲"];

  for (let i = 0; i < amount; i++) {
    const item = document.createElement("div");

    item.classList.add("floating-item");
    item.innerText = items[Math.floor(Math.random() * items.length)];

    item.style.left = Math.random() * 100 + "vw";
    item.style.fontSize = Math.random() * 16 + 18 + "px";
    item.style.animationDuration = Math.random() * 2 + 2.5 + "s";

    document.body.appendChild(item);

    setTimeout(function () {
      item.remove();
    }, 4500);
  }
}