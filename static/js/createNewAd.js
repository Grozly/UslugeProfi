let adName = document.querySelector("#id_name").value;

document.querySelector("#create-new-ad").addEventListener("click", (event) => {
    event.preventDefault();

    let adName = document.querySelector("#id_name").value;
    let adDescription = document.querySelector("#id_description").value;
    let adImageFile = document.querySelector("#id_photo_announcement").files[0];
    let adCategoty = document.querySelector("#select_category").value;
    let adSubcategory = document.querySelector("#select_subcategory").value;
    let adAddress = document.querySelector("#id_address").value;

    let formData = new FormData();

    formData.set("name", adName);
    formData.set("description", adDescription);
    formData.set("image", adImageFile);
    formData.set("categoty", adCategoty);
    formData.set("subcategory", adSubcategory);
    formData.set("address", adAddress);

    axios.post("/create-ad/", formData, {
        headers: {
            "Content-Type": `multipart/form-data`,
        },
    });
});
