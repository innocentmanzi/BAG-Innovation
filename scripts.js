const inputBox = document.getElementById("input-box");
const categoryInput = document.getElementById("category-input");
const taskList = document.getElementById("taskList");
const categoryFilter = document.getElementById("category-filter");

function addTask() {
  const taskText = inputBox.value.trim();
  const taskCategory = categoryInput.value.trim();
  if (taskText !== "") {
    const li = document.createElement("li");
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <span class="category">${taskCategory}</span>
        <div class="buttons">
            <button class="priority" onclick="togglePriority(this)">Priority</button>
            <button class="edit" onclick="editTask(this)">Edit</button>
            <button class="delete" onclick="deleteTask(this)">Delete</button>
        </div>
        <input type="text" class="edit-input" style="display:none;">
    `;
    taskList.insertBefore(li, taskList.firstChild);
    inputBox.value = "";
    categoryInput.value = "";

    saveData();
    saveCategories();

  } else {
    alert("You must write something!");
  }
}

function filterTasksByCategory() {
    const selectedCategory = categoryFilter.value.toLowerCase();
    const tasks = document.querySelectorAll("#taskList li");
    
    tasks.forEach((task) => {
        const taskCategory = task.querySelector(".category").innerText.toLowerCase();
        const displayStyle = selectedCategory === "all" || taskCategory === selectedCategory ? "flex" : "none";
        task.style.display = displayStyle;
    });
}

taskList.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      saveData();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      saveData();
    }
  },
  false
);

function deleteTask(button) {
  const li = button.parentElement.parentElement;
  li.remove();
  saveData();
}

function togglePriority(button) {
  const li = button.parentElement.parentElement;
  li.classList.toggle("important");
  saveData();
}

function editTask(button) {
  const li = button.parentElement.parentElement;
  const span = li.querySelector("span");
  const input = li.querySelector(".edit-input");

  if (input.style.display === "none") {
    span.style.display = "none";
    input.style.display = "inline-block";
    input.value = span.innerText;
    input.focus();
  } else {
    span.style.display = "inline-block";
    input.style.display = "none";
    span.innerText = input.value.trim();
    saveData();
  }
}

function saveData() {
  localStorage.setItem("Data", taskList.innerHTML);
  saveCategories();
}

function saveCategories() {
    const categories = new Set();
    const tasks = document.querySelectorAll("#taskList li");

    tasks.forEach((task) => {
        const categoryElement = task.querySelector(".category");
        if (categoryElement) {
            const category = categoryElement.innerText.toLowerCase();
            if (category !== "") {
                categories.add(category);
            }
        }
    });

    localStorage.setItem("Categories", JSON.stringify(Array.from(categories)));
    updateCategoryFilter();
}

function showTask() {
  taskList.innerHTML = localStorage.getItem("Data");
  updateCategoryFilter();
}

function updateCategoryFilter() {
    const savedCategories = JSON.parse(localStorage.getItem("Categories")) || [];
    const categoryFilter = document.getElementById("category-filter");

    // Remove existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    if (savedCategories.length > 0) {
        // Add categories to the filter
        savedCategories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.toLowerCase();
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
}

showTask();

updateCategoryFilter();
