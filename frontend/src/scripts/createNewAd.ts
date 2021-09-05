import { createAdAPI } from "./api/adsApi";
import { getAllCategoriesAPI, getServicesBySubcategoryAPI, getSubcategoriesByCategoryAPI } from "./api/api";
import { getLocationOfAddressAPI } from "./api/geocodingAPI";
import { initMap } from "./map";

const csrf: HTMLInputElement = document.getElementsByName("csrfmiddlewaretoken")[0] as HTMLInputElement;

const form: HTMLInputElement = document.getElementsByClassName("create_new_ad_from")[0] as HTMLInputElement;
const adName: HTMLInputElement = document.getElementsByClassName("ad_name_input")[0] as HTMLInputElement;
const adDescription: HTMLInputElement = document.getElementsByClassName("ad_description_input")[0] as HTMLInputElement;
const adCategoty: HTMLInputElement = document.getElementsByClassName("ad_category_input")[0] as HTMLInputElement;
const adSubcategory: HTMLInputElement = document.getElementsByClassName("ad_subcategory_input")[0] as HTMLInputElement;
const subcategoryText: HTMLInputElement = document.getElementsByClassName("ad_subcategory_text")[0] as HTMLInputElement;
const adAddress: HTMLInputElement = document.getElementsByClassName("ad_address_input")[0] as HTMLInputElement;
const adImageBox: HTMLInputElement = document.getElementsByClassName("ad_image_block")[0] as HTMLInputElement;
const userID: HTMLInputElement = document.getElementsByName("user_id")[0] as HTMLInputElement;
const adImageFile: HTMLInputElement = document.getElementsByClassName(
    "ad_photo_announcement_input"
)[0] as HTMLInputElement;

let map: google.maps.Map<HTMLElement>;
let selectedLocationLatLng: google.maps.LatLng;
let selectedLocationMarker: google.maps.Marker;

enum PriceTypes {
    Fixed = 1,
    Negotiable = 2,
    Range = 3,
}

initMap().then((res) => {
    map = res;
});

function validateForm() {
    console.log(adName.value);
    if (!adName.value) {
        alert("Name not selected");
        return false;
    }

    if (!adDescription.value) {
        alert("Description not selected");
        return false;
    }

    if (!adImageFile.files[0]) {
        alert("Image not selected");
        return false;
    }

    if (!adAddress.value) {
        alert("Address not selected");
        return false;
    }

    return true;
}

if (form) {
    let addressChangeTimeout: NodeJS.Timeout;

    adAddress.addEventListener("input", (event) => {
        if (addressChangeTimeout) clearTimeout(addressChangeTimeout);
        addressChangeTimeout = setTimeout(async () => {
            const result = await getLocationOfAddressAPI((event.target as HTMLInputElement).value);

            if (!(Array.isArray(result.data.results) && result.data.results.length > 0 && map)) {
                console.log(result.data);
                selectedLocationLatLng = undefined;
                selectedLocationMarker = undefined;
                return;
            }

            let addressLocation = result.data.results[0].geometry.location;

            // Deleting old marker
            if (selectedLocationMarker) selectedLocationMarker.setMap(null);

            selectedLocationLatLng = addressLocation;
            selectedLocationMarker = new google.maps.Marker({ position: addressLocation });

            map.setCenter(addressLocation);
            selectedLocationMarker.setMap(map);
            (event.target as HTMLInputElement).value = result.data.results[0].formatted_address;
        }, 1500);
    });

    adImageFile.addEventListener("change", () => {
        const image_data = adImageFile.files[0];
        const url = URL.createObjectURL(image_data);
        adImageBox.innerHTML = `<a href="${url}"><img src="${url}" height="250px"></a>`;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validateForm()) return null;

        const optionsArray: Array<{
            id: string;
            name: string;
            select_price: string;
            select_currency: string;
            select_measurement: string;

            fixed_price?: string;
            lower_price?: string;
            upper_price?: string;
        }> = [];

        const adOptions = document.querySelectorAll(".new_ad_options");
        let isOptionsSelected = false;

        adOptions.forEach((item, index) => {
            const name = (item.querySelectorAll(".subcat_checkbox")[0] as HTMLInputElement).labels[0].innerText;
            const fixedPrice = item.getElementsByClassName("ads_input_fixed")[0] as HTMLInputElement;
            const lowerPrice = item.getElementsByClassName("ads_input_lower")[0] as HTMLInputElement;
            const upperPrice = item.getElementsByClassName("ads_input_upper")[0] as HTMLInputElement;
            const checkbox = item.getElementsByClassName("subcat_checkbox")[0] as HTMLInputElement;
            const priceSelector = item.getElementsByClassName("new_ad_price_category")[0] as HTMLInputElement;
            const adSelectPrice = item.getElementsByClassName("select_price")[0] as HTMLInputElement;
            const adSelectCurrency = item.getElementsByClassName("select_currency")[0] as HTMLInputElement;
            const adSelectMeasurement = item.getElementsByClassName("select_measurement")[0] as HTMLInputElement;

            const optionID = item.getAttribute("data-id");

            if (checkbox.checked) {
                isOptionsSelected = true;

                optionsArray.push({
                    id: optionID,
                    name: name,
                    select_price: adSelectPrice.value,
                    select_currency: adSelectCurrency.value,
                    select_measurement: adSelectMeasurement.value,
                    fixed_price: Number(priceSelector.value) === PriceTypes.Fixed ? fixedPrice.value : undefined,
                    lower_price: Number(priceSelector.value) === PriceTypes.Range ? lowerPrice.value : undefined,
                    upper_price: Number(priceSelector.value) === PriceTypes.Range ? upperPrice.value : undefined,
                });
            }
        });

        if (!isOptionsSelected) {
            alert("Options not selected");
            return null;
        }

        const fd = new FormData();
        fd.append("csrfmiddlewaretoken", csrf.value);
        fd.append("user_id", userID.value);
        fd.append("name", adName.value);
        fd.append("description", adDescription.value);
        fd.append("image", adImageFile.files[0]);
        fd.append("categoty", adCategoty.value);
        fd.append("subcategory", adSubcategory.value);
        fd.append("address", adAddress.value);
        fd.append("options", JSON.stringify(optionsArray));
        fd.append("coordinates", JSON.stringify(selectedLocationLatLng));

        createAdAPI(fd, csrf.value).then((res) => {
            if (res.status === 200) location.reload();
            console.log(res);
        });
    });

    getAllCategoriesAPI().then((res) => {
        if (res.status !== 200) {
            console.log(res);
            return;
        }

        const categoryData = res.data.data;
        categoryData.forEach((item: any) => {
            const option = document.createElement("option");
            option.textContent = item.name;
            option.setAttribute("class", "item");
            option.setAttribute("value", item.id);
            adCategoty.appendChild(option);
        });
    });

    adCategoty.addEventListener("change", (e) => {
        const selectedCategory = (e.target as HTMLSelectElement).selectedIndex;

        adSubcategory.innerHTML = "";
        subcategoryText.textContent = "-- Выберите подкатегорию --";

        getSubcategoriesByCategoryAPI(selectedCategory).then((res) => {
            if (res.status !== 200) {
                console.log(res);
                return;
            }

            adSubcategory.innerHTML = `
                <option selected disabled="True" id="subcategory_text">
                    -- Выберите подкатегорию --
                </option>`;

            var adsBlock = document.getElementById("ads_by_subcategory_block");
            adsBlock.innerHTML = "";

            res.data.data.forEach((item: any) => {
                adSubcategory.innerHTML =
                    adSubcategory.innerHTML +
                    `<option value="${item.id}">
                       ${item.name}
                   </option>`;
            });
        });
    });

    adSubcategory.addEventListener("change", (e) => {
        const selectedSubcategory = Number((e.target as HTMLSelectElement).value);

        getServicesBySubcategoryAPI(selectedSubcategory).then((res) => {
            if (res.status !== 200) {
                console.log(res);
                return;
            }

            var adsBlock = document.getElementById("ads_by_subcategory_block");
            adsBlock.innerHTML = "";

            res.data.data.forEach((item: any, index: number) => {
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
                            <option value="1" selected>Цена</option>
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

            const priceSelectors = Array.from(document.getElementsByClassName("new_ad_price_category"));

            priceSelectors.forEach((priceSelector) =>
                priceSelector.addEventListener("change", (event: InputEvent) => {
                    const eventTarget = event.target as HTMLSelectElement;
                    const eventTargetValue = Number(eventTarget.value) as PriceTypes;

                    const priceTypesInputsDispay = new Map<number, { fixed: string; range: string }>();

                    priceTypesInputsDispay.set(PriceTypes.Fixed, {
                        fixed: "block",
                        range: "none",
                    });
                    priceTypesInputsDispay.set(PriceTypes.Negotiable, {
                        fixed: "none",
                        range: "none",
                    });
                    priceTypesInputsDispay.set(PriceTypes.Range, {
                        fixed: "none",
                        range: "block",
                    });

                    (
                        eventTarget.parentElement.getElementsByClassName("ads_input_fixed")[0] as HTMLInputElement
                    ).style.display = priceTypesInputsDispay.get(eventTargetValue).fixed;
                    (
                        eventTarget.parentElement.getElementsByClassName("ads_input_lower")[0] as HTMLInputElement
                    ).style.display = priceTypesInputsDispay.get(eventTargetValue).range;
                    (
                        eventTarget.parentElement.getElementsByClassName("ads_input_upper")[0] as HTMLInputElement
                    ).style.display = priceTypesInputsDispay.get(eventTargetValue).range;
                })
            );
        });
    });
}
