const modalContainer = document.querySelector(".modal-container");
const modalContent = document.querySelector(".modal-content");
const deleteModal = document.querySelector(".delete-launch");
const actionConfirmationBoxDel = document.querySelector(".del-action-confirmation-box");
const actionResultBoxDel = document.querySelector(".del-action-result-box");
const modalMessageAcDel = document.querySelector(".del-ac-modal-message");
const modalMessageArDel = document.querySelector(".del-ar-modal-message");
const deleteBtn = document.querySelectorAll(".launch-delete-modal");
const okAcDel = document.getElementById("del-ac-ok");
const okArDel = document.getElementById("del-ar-ok");
const cancel = document.querySelector("[data-cancel]");

deleteBtn.forEach(btn => {
    btn.addEventListener("click", (event) => {
        let target = event.target;
        let tableID;
        while (target.parentNode) {
            if (target.dataset.idHolder) {
                tableID = target.dataset.idHolder
                break;
            }
            target = target.parentNode;
        }
        deleteModal.style.display = "flex";
        actionConfirmationBoxDel.style.display = "flex";
        actionResultBoxDel.style.display = "flex";
        modalContainer.style.display = "flex";
        document.body.classList.add('nav-active');
        modalMessageAcDel.innerHTML = "Deleting the table deletes any other data associated with it. Are you sure you want to delete this table ID: " + tableID + " ?";
        okAcDel.addEventListener("click", () => {
            let xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", `tables/${tableID}`, true);
            xhttp.send();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const responseText = JSON.parse(this.responseText);
                    const pageUrl = window.location.href;
                    if (responseText.redirect) {
                        window.location.href = responseText.redirect;
                    } else {
                        console.log(responseText);
                        actionConfirmationBoxDel.classList.add("gone");
                        actionResultBoxDel.classList.add("show");
                        setTimeout(() => {
                            actionConfirmationBoxDel.style.display = "none";
                        }, 1000);
                        if (responseText.status) {
                            modalMessageArDel.innerHTML = "Table ID: " + responseText.deletedId._id + " has been deleted as well as " + responseText.deletedBookings.deletedCount + " bookings assigned to " + responseText.deletedId._id + ".";
                            okArDel.addEventListener("click", () => {
                                modalContainer.style.display = "none";
                                document.body.classList.remove("nav-active");
                                window.location.href = pageUrl;
                            });
                        } else {
                            modalMessageArDel.innerHTML = responseText.message;
                            okArDel.addEventListener("click", () => {
                                modalContainer.style.display = "none";
                                document.body.classList.remove("nav-active");
                            });
                        }
                    }
                }
            };
        });
    });
});

cancel.addEventListener("click", () => {
    modalContainer.style.display = "none";
    deleteModal.style.display = "none";
    document.body.classList.remove('nav-active');
});