var timeOut;

function loader() {
    timeOut = setTimeout(showPage, 1000);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("page").style.display = "block";
}

loader()

console.log("Loader loaded")