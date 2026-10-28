// Paste your deployed Google Apps Script Web App URL here after setup.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzHa36hLwIlTsQkA54_xB-ejnwSg0jB--zEFtEPdfJBS3hLV_aE-hd2iJ8TOdLoQ0oERQ/exec";

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

// Category filters
const filterButtons = document.querySelectorAll(".filter-chip");
const storyCards = document.querySelectorAll(".story-card");
const emptyFilter = document.getElementById("emptyFilter");
filterButtons.forEach(button => button.addEventListener("click", () => {
  filterButtons.forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  const category = button.dataset.filter;
  let visible = 0;
  storyCards.forEach(card => {
    const show = category === "all" || card.dataset.category === category;
    card.hidden = !show;
    if (show) visible++;
  });
  emptyFilter.hidden = visible !== 0;
}));

// Google Apps Script accepts this form request in no-cors mode.
// The browser cannot read the response in no-cors mode, so we display a clear
// "sent" message after dispatch, not a claim that the sheet row was verified.
const storyForm = document.getElementById("storyForm");
const submitButton = document.getElementById("submitButton");
const formStatus = document.getElementById("formStatus");

storyForm.addEventListener("submit", async event => {
  event.preventDefault();
  formStatus.className = "form-status";
  if (GOOGLE_SCRIPT_URL.includes("PASTE_YOUR_")) {
    formStatus.textContent = "Setup needed: add your deployed Google Apps Script Web App URL in script.js.";
    formStatus.classList.add("error");
    return;
  }

  const data = Object.fromEntries(new FormData(storyForm).entries());
  delete data.consent;
  data.submittedAt = new Date().toISOString();
  submitButton.disabled = true;
  submitButton.querySelector(".button-label").textContent = "Sending...";

  try {
    const body = new URLSearchParams(data);
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body
    });
    formStatus.textContent = "Your form was sent. The browser cannot verify the Google Sheets row in this mode; check your sheet if needed.";
    formStatus.classList.add("success");
    storyForm.reset();
  } catch (error) {
    formStatus.textContent = "We couldn't send your submission. Check your connection and try again.";
    formStatus.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector(".button-label").textContent = "Send your story";
  }
});
