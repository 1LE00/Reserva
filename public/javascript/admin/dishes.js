const modalContainer = document.querySelector(".modal-container");
const modalContent = document.querySelector(".modal-content");
const editModal = document.querySelector(".edit-launch");
const deleteModal = document.querySelector(".delete-launch");
const actionConfirmationBoxEd = document.querySelector(".ed-action-confirmation-box");
const actionResultBoxEd = document.querySelector(".ed-action-result-box");
const actionConfirmationBoxDel = document.querySelector(".del-action-confirmation-box");
const actionResultBoxDel = document.querySelector(".del-action-result-box");
const modalMessageAcEd = document.querySelector(".ed-ac-modal-message");
const modalMessageArEd = document.querySelector(".ed-ar-modal-message");
const modalMessageAcDel = document.querySelector(".del-ac-modal-message");
const modalMessageArDel = document.querySelector(".del-ar-modal-message");
const editBtn = document.querySelectorAll(".launch-edit-modal");
const deleteBtn = document.querySelectorAll(".launch-delete-modal");
const okAcEd = document.getElementById("ed-ac-ok");
const okArEd = document.getElementById("ed-ar-ok");
const okAcDel = document.getElementById("del-ac-ok");
const okArDel = document.getElementById("del-ar-ok");
const cancel = document.querySelectorAll("[data-cancel]");
const editform = document.getElementById("edit-dish");
const closeEdit = document.querySelectorAll("[data-close-edit]");


/**
 * * Edit reservation-form 
    /* Form scripts */

closeEdit.forEach(close => {
    close.addEventListener("click", () => {
        editform.style.display = "none";
        modalContainer.style.display = "none";
        document.body.classList.remove('nav-active');
    });
});

editBtn.forEach(btn => {
    btn.addEventListener("click", (event) => {
        let target = event.target;
        let bookingID;
        while (target.parentNode) {
            if (target.dataset.idHolder) {
                bookingID = target.dataset.idHolder
                break;
            }
            target = target.parentNode;
        }
        editModal.style.display = "flex";
        modalContainer.style.display = "flex";
        actionConfirmationBoxEd.style.display = "flex";
        document.body.classList.add('nav-active');
        modalMessageAcEd.innerHTML = "Are you sure you want to edit your Meal ID: " + bookingID + " ?";
        okAcEd.addEventListener("click", () => {
            actionConfirmationBoxEd.style.display = "none";
            editform.style.display = "flex";
            modalContent.style.margin = "0";
            editform.addEventListener("submit", (event) => {
                event.preventDefault();
                let xhttp = new XMLHttpRequest();
                const formData = new FormData(editform);
                const encodedData = new URLSearchParams(formData).toString();
                editform.setAttribute('action', `/reserva/dishes/${bookingID}`)
                const url = editform.getAttribute('action');
                xhttp.open("POST", url, true);
                xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhttp.send(encodedData);
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        const pageUrl = window.location.href;
                        const responseText = JSON.parse(this.responseText);
                        if (responseText.redirect) {
                            window.location.href = responseText.redirect;
                        } else {
                            actionResultBoxEd.classList.add("show");
                            if (responseText.status) {
                                editform.style.display = "none";
                                modalMessageArEd.innerHTML = "Your meal ID: " + responseText.updatedRecord + " has been updated.";
                                okArEd.addEventListener("click", () => {
                                    modalContainer.style.display = "none";
                                    editModal.style.display = "none";
                                    document.body.classList.remove("nav-active");
                                    window.location.href = pageUrl;
                                });
                            } else {
                                editform.style.display = "none";
                                modalMessageArEd.innerHTML = responseText.message;
                                okArEd.addEventListener("click", () => {
                                    modalContainer.style.display = "none";
                                    editModal.style.display = "none";
                                    actionResultBoxEd.style.display = "none";
                                    document.body.classList.remove("nav-active");
                                });
                            }
                        }
                    }
                };
            });
        });
    });
});

deleteBtn.forEach(btn => {
    btn.addEventListener("click", (event) => {
        let target = event.target;
        let mealID;
        while (target.parentNode) {
            if (target.dataset.idHolder) {
                mealID = target.dataset.idHolder
                break;
            }
            target = target.parentNode;
        }
        deleteModal.style.display = "flex";
        actionConfirmationBoxDel.style.display = "flex";
        actionResultBoxDel.style.display = "flex";
        modalContainer.style.display = "flex";
        document.body.classList.add('nav-active');
        modalMessageAcDel.innerHTML = "Are you sure you want to delete Meal ID: " + mealID + " ?";
        okAcDel.addEventListener("click", () => {
            let xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", `dishes/${mealID}`, true);
            xhttp.send();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const responseText = JSON.parse(this.responseText);
                    const pageUrl = window.location.href;
                    if (responseText.redirect) {
                        window.location.href = responseText.redirect;
                    } else {
                        actionConfirmationBoxDel.classList.add("gone");
                        actionResultBoxDel.classList.add("show");
                        setTimeout(() => {
                            actionConfirmationBoxDel.style.display = "none";
                        }, 1000);
                        if (responseText.status) {
                            modalMessageArDel.innerHTML = "Meal ID: " + responseText.deletedId._id + " has been deleted.";
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

cancel.forEach(c => {
    c.addEventListener("click", () => {
        modalContainer.style.display = "none";
        editModal.style.display = "none";
        deleteModal.style.display = "none";
        document.body.classList.remove('nav-active');

    });
});
