const modalContainer = document.querySelector(".modal-container");
const actionConfirmationBox = document.querySelector(".action-confirmation-box");
const actionResultBox = document.querySelector(".action-result-box");
const modalHeading = document.querySelector(".modal-heading");
const modalMessageAc = document.querySelector(".ac-modal-message");
const modalMessageAr = document.querySelector(".ar-modal-message");
const deleteBtn = document.querySelectorAll(".launch-delete-modal");
const okAc = document.getElementById("ac-ok");
const okAr = document.getElementById("ar-ok");
const cancel = document.getElementById("ac-cancel");

deleteBtn.forEach(btn => {
    btn.addEventListener("click", (event) => {
        let target = event.target;
        let waitlistID;
        while (target.parentNode) {
            if (target.dataset.idHolder) {
                waitlistID = target.dataset.idHolder
                break;
            }
            target = target.parentNode;
        }
        modalContainer.style.display = "flex";
        document.body.classList.add('nav-active');
        modalHeading.innerHTML = "Cancel Waitlist";
        modalMessageAc.innerHTML = `Are you sure you want to exclude Waitlist ID: ${waitlistID} from the waitlist?`;
        okAc.addEventListener("click", () => {
            let xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", `waitlist/${waitlistID}`, true);
            xhttp.send();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const responseText = JSON.parse(this.responseText);
                    const pageUrl = window.location.href;
                    if (responseText.redirect) {
                        window.location.href = responseText.redirect;
                    } else {
                        console.log(responseText);
                        actionConfirmationBox.classList.add("gone");
                        cancel.style.display = "none";
                        actionResultBox.classList.add("show");
                        setTimeout(() => {
                            actionConfirmationBox.style.display = "none";
                        }, 1000);
                        if (responseText.status) {
                            modalMessageAr.innerHTML = "Waitlist ID: " + responseText.deletedId + " has been excluded.";
                            okAr.addEventListener("click", () => {
                                modalContainer.style.display = "none";
                                document.body.classList.remove("nav-active");
                                window.location.href = pageUrl;
                            });
                        } else {
                            modalMessageAr.innerHTML = responseText.message;
                            okAr.addEventListener("click", () => {
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
    document.body.classList.remove('nav-active');
});

