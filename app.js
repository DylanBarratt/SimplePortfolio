const body = document.body;
const toggle = document.getElementById("toggle");

function changeTheme() {
    if (body.classList.contains("light")) {
        body.className = "dark";
        toggle.innerText = "🌞";
    } else {
        body.className = "light";
        toggle.innerText = "🌚";
    }
}
