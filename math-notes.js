function loadPage() {
    try {
        page = window.location.toString().split('?')[1].substring(7);
        document.getElementById("lesson-" + page).style.visibility = "visible";
        document.getElementById("lesson-" + page).style.display = "block";
        document.getElementById("lesson-button-" + page).style.backgroundColor = "rgb(171, 124, 41)";
    } catch (error) {}
}