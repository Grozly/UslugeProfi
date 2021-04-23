const imgBox = document.getElementById('imgBox');
const form = document.getElementById('create_new_ad_from');
const adName = document.getElementById("id_name");
const adDescription = document.getElementById("id_description");
const adCategoty = document.querySelector("#select_category");
const adSubcategory = document.querySelector("#select_subcategory");
const adSelectPrice = document.querySelector("#select_price");
const adSelectCurrency = document.querySelector("#select_currency");
const adSelectMeasurement = document.querySelector("#select_measurement");
const adService = document.querySelector(".subcat_checkbox");
const adAddress = document.getElementById("id_address");
const fixedPrice = document.querySelector("#new_ad_fixed_price")
    ? document.querySelector("#new_ad_fixed_price"): null;
const lowerPrice = document.querySelector("#new_ad_lower_price")
    ? document.querySelector("#new_ad_lower_price"): null;
const upperPrice = document.querySelector("#new_ad_upper_price")
    ? document.querySelector("#new_ad_upper_price"): null;
const adImageFile = document.getElementById("id_photo_announcement");
const csrf = document.getElementsByName('csrfmiddlewaretoken');
const url = ""

adImageFile.addEventListener('change', ()=>{
    const image_data = adImageFile.files[0]
    const url = URL.createObjectURL(image_data)
    imgBox.innerHTML = `<a href="${url}"><img src="${url}" height="250px"></a>`

})
form.addEventListener('submit', event=>{
    event.preventDefault();

    const fd = new FormData()
    fd.append('csrfmiddlewaretoken', csrf[0].value);
    fd.append('name', adName.value);
    fd.append('description', adDescription.value);
    fd.append('categoty', adCategoty.value);
    fd.append('image', adImageFile.files[0]);
    fd.append('subcategory', adSubcategory.value);
    console.log(fd)
    console.log(csrf)

    if (adService.checked) {
        fd.append("service", adService.value);
        fd.append("select_price", adSelectPrice.value);
        fd.append("select_currency", adSelectCurrency.value);
        fd.append("select_measurement", adSelectMeasurement.value);
    }

    if (fixedPrice) fd.append("price", fixedPrice.value);
    if (lowerPrice && upperPrice) {
        fd.append("lower_price", lowerPrice.value);
        fd.append("upper_price", upperPrice.value);
    }

    fd.append('address', adAddress.value);
    console.log(fd);
    console.log(fd.getAll('files'));
    console.log(fd.get('image'));
    $.ajax({
        type: "POST",
        url: "/create-ad/",
        enctype: "multipart/form-data",
        data: fd,
        success: function(response){
            console.log(response)
        },
        error: function(error){
            console.log(error)
        },
        cache: false,
        contentType: false,
        processData: false,
    })

})
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
