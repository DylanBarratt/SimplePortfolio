const body = document.body;
const toggle = document.getElementById("toggle");

if (localStorage.getItem("theme") == "dark") {
    body.className = "dark";
    toggle.innerText = "🌞";
} else {
    body.className = "light";
    toggle.innerText = "🌚";
}

function changeTheme() {
    if (body.classList.contains("light")) {
        body.className = "dark";
        toggle.innerText = "🌞";
        localStorage.setItem("theme", "dark");
    } else {
        body.className = "light";
        toggle.innerText = "🌚";
        localStorage.setItem("theme", "light");
    }
}

function conwayGIF(img, show) {
    if (show) {
        img.src = "images/conway.gif";
    } else {
        img.src = "images/conway.jpg";
    }
}

function snakeGIF(img, show) {
    if (show) {
        img.src = "images/snake.gif";
    } else {
        img.src = "images/snake.jpg";
    }
}
