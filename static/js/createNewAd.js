var adName = document.querySelector("#id_name").value;

document.querySelector("#create-new-ad").addEventListener("click", (event) => {
    event.preventDefault();

    var adName = document.querySelector("#id_name").value;
    var adDescription = document.querySelector("#id_description").value;
    var adImageFile = document.querySelector("#id_photo_announcement").files[0];
    var adCategoty = document.querySelector("#select_category").value;
    var adSubcategory = document.querySelector("#select_subcategory").value;
    var adAddress = document.querySelector("#id_address").value;

    var fixedPrice = document.querySelector("#new_ad_fixed_price")
        ? document.querySelector("#new_ad_fixed_price").value
        : null;

    var lowerPrice = document.querySelector("#new_ad_lower_price")
        ? document.querySelector("#new_ad_lower_price").value
        : null;

    var upperPrice = document.querySelector("#new_ad_upper_price")
        ? document.querySelector("#new_ad_upper_price").value
        : null;

    var formData = new FormData();

    formData.set("name", adName);
    formData.set("description", adDescription);
    formData.set("image", adImageFile);
    formData.set("categoty", adCategoty);
    formData.set("subcategory", adSubcategory);
    formData.set("address", adAddress);

    if (fixedPrice) formData.set("price", fixedPrice);
    if (lowerPrice && upperPrice) {
        formData.set("lower_price", lowerPrice);
        formData.set("upper_price", upperPrice);
    }

    axios.post("/create-ad/", formData, {
        headers: {
            "Content-Type": `multipart/form-data`,
        },
    });
});
