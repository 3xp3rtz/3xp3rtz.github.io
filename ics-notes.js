function loadPage() {
    try {
        page = window.location.toString().split('?')[1].substring(5);
        document.getElementById("content-" + page).style.visibility = "visible";
        document.getElementById("content-" + page).style.display = "block";
    } catch (error) {}
}