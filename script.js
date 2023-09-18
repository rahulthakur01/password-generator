const inputSlider = document.querySelector("[data-lengthSlider]");
const displayLength = document.querySelector("[data-lengthNumber]");
const indicator = document.querySelector("[data-indicator]");
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMessage]");
const uppercaseChecked = document.querySelector("#uppercase");
const lowercaseChecked = document.querySelector("#lowercase");
const numberChecked = document.querySelector("#numbers");
const symbolChecked = document.querySelector("#symbols");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordLength;
  displayLength.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123))
}
function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91))
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbol.length);
  return symbol.charAt(randNum);
}

function calcStrength() {
  let isUpper = false;
  let isLower = false;
  let isNum = false;
  let isSym = false;
  if(uppercaseChecked.checked) isUpper = true;
  if(lowercaseChecked.checked) isLower= true;
  if(numberChecked.checked) isNum = true;
  if(symbolChecked.checked) isSym = true;

  if (isUpper && isLower && (isNum || isSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if ((isUpper || isLower) && (isNum || isSym) && passwordLength >= 6) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    // writeText method passwordDisplay ke value ko copy karta hai
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "failed";
  }
  // copy wala word visible karne ke liye
  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

// e.target is basically slider change value
inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
})

copyBtn.addEventListener('click', () => {
  if (passwordDisplay.value) copyContent();
})

function handleCheckBox() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  // spacial condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) =>{
  checkbox.addEventListener('change',handleCheckBox);
})

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


// generate button
generateBtn.addEventListener('click', () => {
  if (checkCount == 0) return;
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  // lets start new password
  console.log("yaha se new password ");
  password = "";

  let funArr = [];

  if (uppercaseChecked.checked) funArr.push(generateUpperCase);

  if (lowercaseChecked.checked) funArr.push(generateLowerCase);

  if (numberChecked.checked) funArr.push(generateRandomNumber);

  if (symbolChecked.checked) funArr.push(generateSymbol);

  for (let i = 0; i < funArr.length; i++) {
    password += funArr[i]();
  }

  console.log("compulsory addition is done");

  //remaining adddition
  for (let i = 0; i < passwordLength - funArr.length; i++) {
    let randIndex = getRndInteger(0, funArr.length);
    // console.log("randIndex" + randIndex);
    password += funArr[randIndex]();
  }
  console.log("remaining addition done");

  password = shufflePassword(Array.from(password));
  passwordDisplay.value = password;

  calcStrength();

});
