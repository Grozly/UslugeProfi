export enum PopupsEnum {
    loginPopup = "login-popup",
    registerPopup = "register-popup",
    successedRegistrationPopup = "successed-registeration-popup",
}

export function closePopup() {
    popupWrapperElement.className = popupWrapperElement.className.replace(/popup__wrapper__shown/g, "").trim();

    popupsData.forEach((popupsDataItem) => {
        const popupContentElement = document.getElementById(popupsDataItem.popup);
        popupContentElement.className.replace(/popup__popup-view__shown/g, "").trim();
    });
}

export function openPopup(popup: PopupsEnum) {
    if (!/popup__wrapper__shown/g.test(popupWrapperElement.className))
        popupWrapperElement.className = popupWrapperElement.className + " popup__wrapper__shown";

    popupsData.forEach((popupsDataItem) => {
        const popupContentElement = document.getElementById(popupsDataItem.popup);
        popupContentElement.className =
            popupsDataItem.popup === popup
                ? popupContentElement.className + " popup__popup-view__shown"
                : popupContentElement.className.replace(/popup__popup-view__shown/g, "").trim();
    });
}

const popupsData = [
    {
        popup: PopupsEnum.loginPopup,
    },
    {
        popup: PopupsEnum.registerPopup,
    },
    {
        popup: PopupsEnum.successedRegistrationPopup,
    },
];

const popupCloseButtonElement = Array.from(document.getElementsByClassName("popup__close-button"))[0];
const popupWrapperElement = Array.from(document.getElementsByClassName("popup__wrapper"))[0];
const popupWrapperInnerElement = Array.from(document.getElementsByClassName("popup__wrapperInner"))[0];

popupCloseButtonElement.addEventListener("click", () => {
    closePopup();
});

popupWrapperElement.addEventListener("click", (event) => {
    if (event.currentTarget === event.target) closePopup();
});

popupWrapperInnerElement.addEventListener("click", (event) => {
    if (event.currentTarget === event.target) closePopup();
});

// Creating open buttons
popupsData.forEach((popupsDataItem) => {
    Array.from(document.getElementsByClassName("open__" + popupsDataItem.popup)).forEach((openButton) =>
        openButton.addEventListener("click", () => {
            openPopup(popupsDataItem.popup);
        })
    );
});
