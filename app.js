const body = document.body;

function changeTheme() {
    if (body.classList.contains("light")) {
        body.className = "dark";
    } else {
        body.className = "light";
    }
}
