
// Theme Toggle
document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Language Switcher
document.getElementById("languageSwitcher").addEventListener("change", function () {
  const lang = this.value;
  document.querySelectorAll("[data-en]").forEach((el) => {
    el.innerText = el.getAttribute(`data-${lang}`);
  });
});

// Save & Load Dashboard Data
const defaultData = {
  studyHours: "15 hrs this week",
  tasksDue: "3 tasks left",
  nextExam: "20 July 2025"
};

function loadDashboardData() {
  const data = JSON.parse(localStorage.getItem("plannerData")) || defaultData;
  document.getElementById("studyHoursValue").innerText = data.studyHours;
  document.getElementById("tasksDueValue").innerText = data.tasksDue;
  document.getElementById("nextExamValue").innerText = data.nextExam;
}

function saveDashboardData(data) {
  localStorage.setItem("plannerData", JSON.stringify(data));
}

document.addEventListener("DOMContentLoaded", function () {
  loadDashboardData();

  document.getElementById("studyHoursCard").addEventListener("click", function () {
    const newVal = prompt("Enter new study hours (e.g. '20 hrs this week'):");
    if (newVal) {
      const data = JSON.parse(localStorage.getItem("plannerData")) || defaultData;
      data.studyHours = newVal;
      saveDashboardData(data);
      loadDashboardData();
    }
  });

  document.getElementById("tasksDueCard").addEventListener("click", function () {
    const newVal = prompt("Enter new task count (e.g. '5 tasks left'):");
    if (newVal) {
      const data = JSON.parse(localStorage.getItem("plannerData")) || defaultData;
      data.tasksDue = newVal;
      saveDashboardData(data);
      loadDashboardData();
    }
  });

  document.getElementById("nextExamCard").addEventListener("click", function () {
    const newVal = prompt("Enter next exam date (e.g. '25 August 2025'):");
    if (newVal) {
      const data = JSON.parse(localStorage.getItem("plannerData")) || defaultData;
      data.nextExam = newVal;
      saveDashboardData(data);
      loadDashboardData();
    }
  });
});
