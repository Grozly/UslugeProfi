$("body").on("click", ".showPasswordToggleOne", function () {
    if ($("#password-input").attr("type") == "password") {
        $(this).addClass("view");
        $("#password-input").attr("type", "text");
    } else {
        $(this).removeClass("view");
        $("#password-input").attr("type", "password");
    }
    return false;
});
$("body").on("click", ".showPasswordToggleTwo", function () {
    if ($("#password-input").attr("type") == "password") {
        $(this).addClass("view");
        $("#password-input").attr("type", "text");
    } else {
        $(this).removeClass("view");
        $("#password-input").attr("type", "password");
    }
    return false;
});

$(document).ready(function () {
    $("a.myLinkModal").click(function (event) {
        event.preventDefault();
        $("#myOverlay").fadeIn(297, function () {
            $("#myModal").css("display", "block").animate({ opacity: 1 }, 198);
        });
    });

    $("#myModal__close, #myOverlay").click(function () {
        $("#myModal").animate({ opacity: 0 }, 198, function () {
            $(this).css("display", "none");
            $("#myOverlay").fadeOut(297);
        });
    });
});

$(document).ready(function () {
    $("a.myLinkModal1").click(function (event) {
        event.preventDefault();
        $("#myOverlay1").fadeIn(297, function () {
            $("#myModal1").css("display", "block").animate({ opacity: 1 }, 198);
        });
    });

    $("#myModal__close1, #myOverlay1").click(function () {
        $("#myModal1").animate({ opacity: 0 }, 198, function () {
            $(this).css("display", "none");
            $("#myOverlay1").fadeOut(297);
        });
    });
});

$(document).ready(function () {
    $("a.myLinkModal2").click(function (event) {
        event.preventDefault();
        $("#myOverlay2").fadeIn(297, function () {
            $("#myModal2").css("display", "block").animate({ opacity: 1 }, 198);
        });
    });

    $("#myModal__close2, #myOverlay2").click(function () {
        $("#myModal2").animate({ opacity: 0 }, 198, function () {
            $(this).css("display", "none");
            $("#myOverlay2").fadeOut(297);
        });
    });
});

$(document).ready(function () {
    $("a.myLinkModal3").click(function (event) {
        event.preventDefault();
        $("#myOverlay3").fadeIn(297, function () {
            $("#myModal3").css("display", "block").animate({ opacity: 1 }, 198);
        });
    });

    $("#myModal__close3, #myOverlay3").click(function () {
        $("#myModal3").animate({ opacity: 0 }, 198, function () {
            $(this).css("display", "none");
            $("#myOverlay3").fadeOut(297);
        });
    });
});

$(document).ready(function () {
    $("#myModal__close4, #myOverlay4").click(function () {
        $("#myModal4").animate({ opacity: 0 }, 198, function () {
            $(this).css("display", "none");
            $("#myOverlay4").fadeOut(297);
        });
    });
});

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

$(function () {
    $("#tel-hide").hide(); // скрываем элементы
    $(".show-tel").on("click", function () {
        // указываем кнопку при клике на которую покажутся элементы
        $(" #tel-hide").show(); // показываем элементы
        appNormalise();
    });
});

$(document).ready(function () {
    $(".new_ad_price_category").change(function (event) {
        console.log(event.target.parentElement.getElementsByClassName("ads_input_fixed")[0]);
        console.log(event.target.parentElement.getElementsByClassName("ads_input_lower")[0]);
        console.log(event.target.parentElement.getElementsByClassName("ads_input_upper")[0]);

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
});
