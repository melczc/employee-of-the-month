import { trustedCounter, scrollCounter, keyCounter } from "./tracker.js";

const staffList = document.getElementById("staff-list");
const captchaContainer = document.getElementById("captcha-container");
const captchaInput = document.getElementById("captcha-input");
const voteMeBtn = document.getElementById("vote-me-btn");
const rankingList = document.getElementById("ranking-order");
const voteBox = document.getElementById("vote-box");
const participate = document.getElementById("join");
const loader = document.getElementById("loader");
const loaderText =document.getElementById("loader-text");
const endVote = document.getElementById("end-vote");
const mainContainer = document.getElementById("main-container");

let captchaText = null;
let trackerOne;
let trackerTwo;
let trackerThree;

//hide at init
voteMeBtn.style.display = "none";
voteBox.style.display = "none";
participate.style.display = "none";
endVote.style.display = "none";
//view when participate
participate.addEventListener("click", () => {

  
  
  
  voteBox.style.display = "flex";
  voteBox.scrollIntoView({ behavior: "smooth" });
});

// fetch data from sheets
const url =
  "https://script.google.com/macros/s/AKfycbxGLVbjJfi4vqd9ak0oUKV-RSK0hn6Vbl_ZRIo_ExzYVm1B5Fqyc2IN2XxEDhJqQPZZ1Q/exec";

let rankingData;

let staffData = [
  { name: "Select your name" },
  // ... more staff
];

fetch(url)
  .then((response) => response.json())
  .then((json) => {
    rankingData = json;
    console.log("this is from google", rankingData.data);

    rankingData.data.forEach((staff) => {
      staffData.push(staff);
    });

    staffData.forEach((staff) => {
      const option = document.createElement("option");
      option.value = staff.name;
      option.text = staff.name;
      staffList.appendChild(option);
    });

    loader.style.display = "none";
    loaderText.style.display = "none";
    participate.style.display = "block";

    // Call updateRanking initially to display the initial ranking
    updateRanking();
  });

console.log(staffData);
console.log(staffData[0]);

// Handle staff selection
staffList.addEventListener("change", () => {
  if (staffList.value !== "Select your name") {
    captchaContainer.style.display = "block";
    voteMeBtn.style.display = "block";
    // Show the button
  } else {
    captchaContainer.style.display = "none";
    voteMeBtn.style.display = "none"; // Hide the button
  }
});

// Handle captcha input
captchaInput.addEventListener("input", () => {
  if (captchaInput.value.length > 0 && staffList.value !== "Select your name") {
    captchaContainer.style.display = "block";
    voteMeBtn.style.display = "block";
    voteMeBtn.disabled = false;
  }
});

captchaInput.addEventListener("input", () => {
  if (captchaInput.value.length == 0) {
    
    voteMeBtn.disabled = true;
  }
});

// Handle vote button click
voteMeBtn.addEventListener("click", () => {
  if (validateCaptcha()) {
    const selectedStaffName = staffList.value;

    // Send POST request to update the vote
    fetch(url, {
      
      method: "POST",
      
      headers: {
        "Content-Type": "text/plain",
        
      },
      body: JSON.stringify({
        name: selectedStaffName
      })
    })
    .then((response) => response.json())
    .then((data) => {
      
      if (data.success) {
        // Successfully updated vote count
        const selectedIndex = staffData.findIndex(
          (staff) => staff.name === selectedStaffName
        );

        updateRanking();

        endOfVote();

        
        setTimeout(refreshPage, 5000);
        

        
      } else {
        alert("Failed to update vote: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error updating vote:", error);
      alert("An error occurred while updating the vote.");
    });
  } else {
    // Handle captcha validation failure
    alert("Your Are A BOT! Say more if you're not!");
  }
});

// Update ranking list
function updateRanking() {
  staffData.sort((a, b) => parseInt(b.votes) - parseInt(a.votes));
  rankingList.innerHTML = "";
  staffData
    .filter((staff) => staff.name !== "Select your name")
    .forEach((staff, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add("ranking-item");
      listItem.style.setProperty("--order" , index + 1);

      const rankSpan = document.createElement("div");
      rankSpan.classList.add("rank");
      rankSpan.textContent = `${index + 1}`;

      const employeeInfoDiv = document.createElement("div");
      employeeInfoDiv.classList.add("employee-info");

      const employeeIcon = document.createElement("img");
      employeeIcon.src = staff.image;
      employeeIcon.alt = `${staff.name} Icon`;

      const employeeNameSpan = document.createElement("div");
      employeeNameSpan.classList.add("employee-name");
      employeeNameSpan.textContent = staff.name;

      const votesSpan = document.createElement("div");
      votesSpan.classList.add("votes");
      votesSpan.textContent = `Votes: ${staff.votes}`;

      
      employeeInfoDiv.appendChild(employeeNameSpan);
      employeeInfoDiv.appendChild(votesSpan);

      listItem.appendChild(rankSpan);
      listItem.appendChild(employeeIcon);
      listItem.appendChild(employeeInfoDiv);
      

      rankingList.appendChild(listItem);
    });
}

// validate captcha
function validateCaptcha() {
  if (trackerOne > 100 && trackerTwo > 1 && trackerThree > 1) {
    return true
  } else {
    return false
  }
  
}

function endOfVote() {
  voteBox.style.display = "none";
  participate.style.display = "none";
  mainContainer.style.display = "none";
  endVote.style.display = "";
}

function refreshPage(){
  location.reload();
}

function updateTracker(){

  trackerOne = trustedCounter;
  trackerTwo = scrollCounter;
  trackerThree = keyCounter;
  // console.log(trackerOne);
  // console.log(trackerTwo);
  // console.log(trackerThree)
 }

 setInterval(updateTracker, 1000)







