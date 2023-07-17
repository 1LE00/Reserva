const homeContent = document.querySelector(".home");
const requestDownload = document.getElementById("request-download");
const requestAccountDelete = document.getElementById("request-account-delete");

const funcitonNotAdded = [requestDownload, requestAccountDelete];
funcitonNotAdded.forEach(fna => {
    fna.addEventListener("click", () => {
        alert("Functionality Not Added Yet");
    });
});
