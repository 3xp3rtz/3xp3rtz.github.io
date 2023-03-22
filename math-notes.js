function loadPage() {
    try {
        page = window.location.toString().split('?')[1].substring(7);
        document.getElementById("lesson-" + page).style.visibility = "visible";
        document.getElementById("lesson-" + page).style.display = "block";
    } catch (error) {}
}