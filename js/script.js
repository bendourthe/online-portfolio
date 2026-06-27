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
        var targetElement = $(this).attr("href");

        if (!targetElement || targetElement.charAt(0) !== "#") {
            return;
        }

        var $target = $(targetElement);

        if (!$target.length) {
            return;
        }

        e.preventDefault();
        var targetPosition = $target.offset().top;
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
    // But this is now handled in inline script in index.html to avoid flicker.
    // We just need to sync the checkbox if the inline script set the class.

    if (body.hasClass("dark-mode")) {
        toggle.prop("checked", false);
    } else {
        toggle.prop("checked", true);
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

/* -------------------------------------------------- constellation background */
var canvas = document.getElementById("constellation");
if (canvas && canvas.getContext) {
  (function () {
    var ctx = canvas.getContext("2d");
    var w, h, dpr, nodes, raf = null, running = false;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }
    function build() {
      var count = Math.max(18, Math.min(46, Math.floor(window.innerWidth / 34)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.16 * dpr,
          vy: (Math.random() - 0.5) * 0.16 * dpr
        });
      }
    }
    function frame(advance) {
      var isDark = document.body.classList.contains("dark-mode");
      ctx.clearRect(0, 0, w, h);
      var maxd = 150 * dpr;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        if (advance) {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        
        if (!isDark) continue;

        for (var j = i + 1; j < nodes.length; j++) {
          var m = nodes[j], dx = n.x - m.x, dy = n.y - m.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxd) {
            ctx.globalAlpha = (1 - d / maxd) * 0.45;
            ctx.strokeStyle = "#2dd4bf";
            ctx.lineWidth = 0.6 * dpr;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }
      
      if (!isDark) return;

      ctx.globalAlpha = 0.85;
      for (var k = 0; k < nodes.length; k++) {
        ctx.fillStyle = "#5eead4";
        ctx.beginPath(); ctx.arc(nodes[k].x, nodes[k].y, 1.5 * dpr, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function loop() { frame(true); raf = window.requestAnimationFrame(loop); }
    resize(); build();
    window.addEventListener("resize", function () { resize(); build(); if (!running) frame(false); });
    
    running = true;
    loop();
  })();
}
