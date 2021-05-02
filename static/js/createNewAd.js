const imgBox = document.getElementById("imgBox");
const form = document.getElementById("create_new_ad_from");
const adName = document.getElementById("id_name");
const adDescription = document.getElementById("id_description");
const adCategoty = document.querySelector("#select_category");
const adSubcategory = document.querySelector("#select_subcategory");
const subcategoryText = document.getElementById("subcategory_text");
const adAddress = document.getElementById("id_address");
const adImageFile = document.getElementById("id_photo_announcement");
const userID = document.getElementsByName("user_id")[0];
const csrf = document.getElementsByName("csrfmiddlewaretoken");

$.ajaxSetup({
    headers: {
        "X-CSRF-TOKEN": csrf[0].value,
    },
});

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
    fd.append("user_id", userID.value);

    const optionsArray = [];

    const adOptions = document.querySelectorAll(".new_ad_options");

    adOptions.forEach((item, index) => {
        const name = item.querySelectorAll(".subcat_checkbox")[0].labels[0]
            .innerText;
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
                        name: name,
                        select_price: adSelectPrice.value,
                        select_currency: adSelectCurrency.value,
                        select_measurement: adSelectMeasurement.value,
                        fixed_price: fixedPrice.value,
                    });
                    break;

                case 2:
                    optionsArray.push({
                        id: optionID,
                        name: name,
                        select_price: adSelectPrice.value,
                        select_currency: adSelectCurrency.value,
                        select_measurement: adSelectMeasurement.value,
                    });
                    break;

                case 3:
                    optionsArray.push({
                        id: optionID,
                        name: name,
                        lower_price: lowerPrice.value,
                        upper_price: upperPrice.value,
                        select_price: adSelectPrice.value,
                        select_currency: adSelectCurrency.value,
                        select_measurement: adSelectMeasurement.value,
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
        const categoryData = response.data;
        categoryData.map((item) => {
            const option = document.createElement("option");
            option.textContent = item.name;
            option.setAttribute("class", "item");
            option.setAttribute("value", item.id);
            adCategoty.appendChild(option);
        });
    },
    error: function (error) {
        console.log(error);
    },
});

adCategoty.addEventListener("change", (e) => {
    const selectedCategory = e.target.selectedIndex;

    adSubcategory.innerHTML = "";
    subcategoryText.textContent = "-- Выберите подкатегорию --";

    $.ajax({
        type: "GET",
        url: `/ajax/subcategory-val/${selectedCategory}/`,
        success: function (response) {
            adSubcategory.innerHTML = `
                <option selected disabled="True" id="subcategory_text">
                    -- Выберите подкатегорию --
                </option>`;

            var adsBlock = document.getElementById("ads_by_subcategory_block");
            adsBlock.innerHTML = "";

            response.data.forEach((item, index) => {
                adSubcategory.innerHTML =
                    adSubcategory.innerHTML +
                    `<option value="${item.id}">
                       ${item.name}
                   </option>`;
            });
        },
        error: function (error) {
            console.log(error);
        },
    });
});

adSubcategory.addEventListener("change", (e) => {
    const selectedSubcategory = e.target.value;

    $.ajax({
        type: "GET",
        url: `/ajax/service-val/${selectedSubcategory}/`,
        success: function (response) {
            var adsBlock = document.getElementById("ads_by_subcategory_block");
            adsBlock.innerHTML = "";

            response.data.forEach((item, index) => {
                adsBlock.innerHTML =
                    adsBlock.innerHTML +
                    `<div class="ads_options new_ad_options" data-id=${item.id}>
                        <div>
                            <input
                                class="subcat_checkbox"
                                type="checkbox"
                                name="option_${item.id}"
                                value="${item.is_active}"
                                id="option_${item.id}"
                            />
                            <label class="label_text" for="option_${item.id}">${item.name}</label><br/>
                        </div>
                        <select id="select_price_${index}" size="1" name="subcategory" class="new_ad_price_category select_price">
                            <option disabled>Цена</option>
                            <option selected value="1">Цена</option>
                            <option value="2">Договорная</option>
                            <option value="3">Диапазон</option>
                        </select>

                        <div class="ads_input_flex">
                            <input
                                id="new_ad_fixed_price_${index}"
                                type="text"
                                class="ads_input ads_input_fixed"
                                placeholder="Цена"
                                style="display: block"
                            />
                            <input
                                id="new_ad_lower_price_${index}"
                                type="text"
                                class="ads_input ads_input_lower"
                                placeholder="Цена от"
                                style="display: none"
                            />
                            <input
                                id="new_ad_upper_price_${index}"
                                type="text"
                                class="ads_input ads_input_upper"
                                placeholder="Цена до"
                                style="display: none"
                            />
                        </div>
                        <select id="select_currency_${index}" size="1" name="subcategory" class="select_currency">
                            <option disabled>Валюта</option>
                            <option value="1">дин</option>
                            <option selected value="2">руб</option>
                            <option value="3">доллар</option>
                        </select>
                        <select id="select_measurement_${index}" size="1" name="subcategory" class="select_measurement">
                            <option value="1">шт</option>
                            <option selected value="2">м2</option>
                            <option value="3">кг</option>
                        </select>
                    </div>`;
            });

            $(".new_ad_price_category").change(function (event) {
                switch (Number(event.target.value)) {
                    case 1:
                        event.target.parentElement.getElementsByClassName(
                            "ads_input_fixed"
                        )[0].style.display = "block";
                        event.target.parentElement.getElementsByClassName(
                            "ads_input_lower"
                        )[0].style.display = "none";
                        event.target.parentElement.getElementsByClassName(
                            "ads_input_upper"
                        )[0].style.display = "none";
                        break;
                    case 2:
                        event.target.parentElement.getElementsByClassName(
                            "ads_input_fixed"
                        )[0].style.display = "none";
                        event.target.parentElement.getElementsByClassName(
                            "ads_input_lower"
                        )[0].style.display = "none";
                        event.target.parentElement.getElementsByClassName(
                            "ads_input_upper"
                        )[0].style.display = "none";
                        break;
                    case 3:
                        event.target.parentElement.getElementsByClassName(
                            "ads_input_fixed"
                        )[0].style.display = "none";
                        event.target.parentElement.getElementsByClassName(
                            "ads_input_lower"
                        )[0].style.display = "block";
                        event.target.parentElement.getElementsByClassName(
                            "ads_input_upper"
                        )[0].style.display = "block";
                        break;
                }
            });
        },
        error: function (error) {
            console.log(error);
        },
    });
});
