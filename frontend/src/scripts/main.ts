document.addEventListener("DOMContentLoaded", () => {
    const mainContentBlock = document.getElementById("main-content");
    const headerBlock = document.getElementById("header");
    const footerBlock = document.getElementById("footer");

    mainContentBlock.style.minHeight = `calc(100vh - ${headerBlock.offsetHeight + footerBlock.offsetHeight}px)`;
});
