$(window).on("load", function () {

    // Loader
    $(".loader .inner").fadeOut(500, function () {
        $(".loader").fadeOut(750)
    });

    // Superslides (Hero)
    $('#slides').superslides({
        animation: 'fade',
        play: 5700,
        pagination: false
    });

    // Typed.js
    var typed = new Typed(".typed", {
        strings: ["AI Strategy ^1000", "Digital Health ^1000", "Machine Learning Leadership ^1000", "MedTech Innovation ^1000", "Computer Vision ^1000", "Agentic AI Systems ^1000"],
        typeSpeed: 70,
        backSpeed: 40,
        loop: true,
        startDelay: 1000,
        showCursor: false
    });

    // Simple Filtering for CSS Grid Portfolio
    $(".filters a").click(function (e) {
        e.preventDefault();

        $(".filters .current").removeClass("current");
        $(this).addClass("current");

        var selector = $(this).attr("data-filter");
        var $itemsContainer = $(".items");

        // Lock the height to prevent scroll jumping
        $itemsContainer.css("min-height", $itemsContainer.height());

        if (selector === '*') {
            $itemsContainer.children("li").show(300);
        } else {
            $itemsContainer.children("li").not(selector).hide(300);
            $itemsContainer.children("li").filter(selector).show(300);
        }

        // Release the height lock after animation
        setTimeout(function () {
            $itemsContainer.css("min-height", "0");
        }, 350);

        return false;
    });

    // Stats Counter
    var statsTopOffset = $(".statsSection").offset().top;
    var countUpFinished = false;

    $(window).scroll(function () {
        if (!countUpFinished && window.pageYOffset > statsTopOffset - $(window).height() + 200) {
            $(".counter").each(function () {
                var element = $(this);
                var endVal = parseInt(element.text());
                element.countup(endVal);
            })
            countUpFinished = true;
        }
    });

    $("[data-fancybox]").fancybox();

    // Smooth Scroll
    $("#navigation li a").click(function (e) {
        e.preventDefault();
        var targetElement = $(this).attr("href");
        var targetPosition = $(targetElement).offset().top;
        $("html, body").animate({ scrollTop: targetPosition - 50 }, "slow")
    });

    const nav = $("#navigation");
    const navTop = nav.offset().top;

    $(window).on("scroll", stickyNavigation);

    function stickyNavigation() {
        var body = $("body");
        if ($(window).scrollTop() >= navTop) {
            body.css("padding-top", nav.outerHeight() + "px");
            body.addClass("fixedNav");
        }
        else {
            body.css("padding-top", 0 + "px");
            body.removeClass("fixedNav")
        }
    }

    // Dark Mode Toggle Switch
    // Logic: Unchecked (Left/Default) = Dark Mode
    //        Checked (Right) = Light Mode
    // OR: let's align with the text in HTML.
    // HTML: DARK [Switch] LIGHT
    // Slider Left (Unchecked) is closer to DARK. Correct? Yes.
    // Slider Right (Checked) is closer to LIGHT. Correct? Yes.
    // So: Unchecked = Dark Mode, Checked = Light Mode.

    var toggle = $("#theme-toggle-checkbox");
    var body = $("body");

    // Check system preference to set INITIAL state
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // If system is dark (or default), we want Unchecked (Dark).
    // If system is light, we wait Checked (Light).

    if (prefersDark) {
        body.addClass("dark-mode");
        toggle.prop("checked", false); // Left = Dark
    } else {
        body.removeClass("dark-mode");
        toggle.prop("checked", true); // Right = Light
    }

    // Toggle Listener
    toggle.change(function () {
        if ($(this).is(":checked")) {
            // Moved to Right -> Light Mode
            body.removeClass("dark-mode");
        } else {
            // Moved to Left -> Dark Mode
            body.addClass("dark-mode");
        }
    });

});
