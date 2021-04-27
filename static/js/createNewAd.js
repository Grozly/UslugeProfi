const imgBox = document.getElementById("imgBox");
const form = document.getElementById("create_new_ad_from");
const adName = document.getElementById("id_name");
const adDescription = document.getElementById("id_description");
const adCategoty = document.querySelector("#select_category");
const adSubcategory = document.querySelector("#select_subcategory");
const subcategoryText = document.getElementById("subcategory_text");
const adAddress = document.getElementById("id_address");
const adOptions = document.querySelectorAll(".new_ad_options");
const adImageFile = document.getElementById("id_photo_announcement");
const userID = document.getElementsByName("user_id")[0];
const csrf = document.getElementsByName("csrfmiddlewaretoken");

adImageFile.addEventListener("change", () => {
    const image_data = adImageFile.files[0];
    const url = URL.createObjectURL(image_data);
    imgBox.innerHTML = `<a href="${url}"><img src="${url}" height="250px"></a>`;
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fd = new FormData();
    fd.append("csrfmiddlewaretoken", csrf[0].value);
    fd.append("name", adName.value);
    fd.append("description", adDescription.value);
    fd.append("categoty", adCategoty.value);
    fd.append("image", adImageFile.files[0]);
    fd.append("subcategory", adSubcategory.value);
    fd.append("address", adAddress.value);
    console.log(userID);
    console.log(userID.value);
    fd.append("user_id", userID.value);
    console.log(fd);
    console.log(csrf);

    const optionsArray = [];

    adOptions.forEach((item, index) => {
        const fixedPrice = item.getElementsByClassName("ads_input_fixed")[0];
        const lowerPrice = item.getElementsByClassName("ads_input_lower")[0];
        const upperPrice = item.getElementsByClassName("ads_input_upper")[0];
        const checkbox = item.getElementsByClassName("subcat_checkbox")[0];
        const priceSelector = item.getElementsByClassName(
            "new_ad_price_category"
        )[0];
        const adSelectPrice = document.getElementsByClassName(
            "select_price"
        )[0];
        const adSelectCurrency = document.getElementsByClassName(
            "select_currency"
        )[0];
        const adSelectMeasurement = document.getElementsByClassName(
            "select_measurement"
        )[0];

        const optionID = item.getAttribute("data-id");

        if (checkbox.checked) {
            switch (Number(priceSelector.value)) {
                case 1:
                    optionsArray.push({
                        id: optionID,
                        select_price: adSelectPrice.value,
                        select_currency: adSelectCurrency.value,
                        select_measurement: adSelectMeasurement.value,
                        fixed_price: fixedPrice.value,
                    });
                    break;

                case 2:
                    optionsArray.push({
                        id: optionID,
                        select_price: adSelectPrice,
                        select_currency: adSelectCurrency,
                        select_measurement: adSelectMeasurement,
                    });
                    break;

                case 3:
                    optionsArray.push({
                        id: optionID,
                        lower_price: lowerPrice.value,
                        upper_price: upperPrice.value,
                        select_price: adSelectPrice,
                        select_currency: adSelectCurrency,
                        select_measurement: adSelectMeasurement,
                    });
                    break;

                default:
                    break;
            }
        }
    });

    fd.append("options", JSON.stringify(optionsArray));

    $.ajax({
        type: "POST",
        url: "/create-ad/",
        enctype: "multipart/form-data",
        data: fd,
        success: function (response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
        },
        cache: false,
        contentType: false,
        processData: false,
    });
});

$.ajax({
        type: "GET",
        url: `/ajax/category-val/`,
        success: function (response) {
            console.log(response.data);
            const categoryData = response.data
            categoryData.map(item=>{
                const option = document.createElement('option')
                option.textContent = item.name
                option.setAttribute('class', 'item')
                option.setAttribute('data-value', item.name)
                adCategoty.appendChild(option)
            })
        },
        error: function (error) {
            console.log(error);
        }
});

adCategoty.addEventListener('change', e=>{
    const selectedCategory = e.target.selectedIndex

    adSubcategory.innerHTML = ""
    subcategoryText.textContent = "-- Выберите подкатегорию --"

    $.ajax({
        type: "GET",
        url: `/ajax/subcategory-val/${selectedCategory}/`,
        success: function (response) {
            const subcategoryData = response.data
            subcategoryData.map(item=>{
                const option = document.createElement('option')
                option.textContent = item.name
                option.setAttribute('class', 'item')
                option.setAttribute('data-value', item.name)
                adSubcategory.appendChild(option)
            })
            },
        error: function (error) {
            console.log(error);
        }
    });

});
//document.querySelector("#create-new-ad").addEventListener("click", (event) => {
//    event.preventDefault();
//    var object = {};
//    var adName = document.querySelector("#id_name").value;
//    var adDescription = document.querySelector("#id_description").value;
//
//    var adCategoty = document.querySelector("#select_category").value;
//    var adSubcategory = document.querySelector("#select_subcategory").value;
//    var adSelectPrice = document.querySelector("#select_price").value;
//    var adSelectCurrency = document.querySelector("#select_currency").value;
//    var adSelectMeasurement = document.querySelector("#select_measurement").value;
//    var adService = document.querySelector(".subcat_checkbox").checked;
//    var adAddress = document.querySelector("#id_address").value;
//
//
//    var fixedPrice = document.querySelector("#new_ad_fixed_price")
//        ? document.querySelector("#new_ad_fixed_price").value
//        : null;
//
//    var lowerPrice = document.querySelector("#new_ad_lower_price")
//        ? document.querySelector("#new_ad_lower_price").value
//        : null;
//
//    var upperPrice = document.querySelector("#new_ad_upper_price")
//        ? document.querySelector("#new_ad_upper_price").value
//        : null;
//
//    var formData = new FormData();
//
//    formData.set("name", adName);
//    formData.set("description", adDescription);
//
//    formData.set("categoty", adCategoty);
//    formData.set("subcategory", adSubcategory);
//
//   if (adService.checked) {
//        formData.set("service", adService);
//        formData.set("select_price", adSelectPrice);
//        formData.set("select_currency", adSelectCurrency);
//        formData.set("select_measurement", adSelectMeasurement);
//    }
//
//    formData.set("address", adAddress);
//
//    if (fixedPrice) formData.set("price", fixedPrice);
//    if (lowerPrice && upperPrice) {
//        formData.set("lower_price", lowerPrice);
//        formData.set("upper_price", upperPrice);
//    }
//
//    formData.forEach((value, key) => {object[key] = value});
//
//    var json = JSON.stringify(object);
//
//    console.log(object)
//    axios.post("/create-ad/", object, {
//        headers: {
//            "Content-Type": `application/json`,
//        },
//    });
//});
