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
            window.localStorage.setItem("portfolio-theme", "light");
        } else {
            // Moved to Left -> Dark Mode
            body.addClass("dark-mode");
            window.localStorage.setItem("portfolio-theme", "dark");
        }
    });

    var skillsExplorer = document.querySelector("[data-skills-explorer]");

    if (skillsExplorer) {
        var skillTabs = Array.prototype.slice.call(skillsExplorer.querySelectorAll('[role="tab"]'));
        var skillPanels = Array.prototype.slice.call(skillsExplorer.querySelectorAll("[data-skill-panel]"));
        var skillTabList = skillsExplorer.querySelector('[role="tablist"]');
        var skillStatus = skillsExplorer.querySelector("[data-skills-status]");
        var skillPrevious = skillsExplorer.querySelector("[data-skills-previous]");
        var skillNext = skillsExplorer.querySelector("[data-skills-next]");
        var skillCurrentIndex = 0;
        var skillNavQuery = window.matchMedia("(max-width: 991px)");

        function skillLabel(index) {
            return skillTabs[index].querySelector("strong").textContent;
        }

        function updateSkillStep(button, targetIndex, direction) {
            var isAvailable = targetIndex >= 0 && targetIndex < skillTabs.length;
            var strong = button.querySelector("strong");

            button.disabled = !isAvailable;
            button.setAttribute("data-target-index", isAvailable ? String(targetIndex) : "");
            strong.textContent = isAvailable ? skillLabel(targetIndex) : (direction === "previous" ? "Start of list" : "End of list");
            button.setAttribute("aria-label", isAvailable ? (direction === "previous" ? "View previous category: " : "View next category: ") + skillLabel(targetIndex) : (direction === "previous" ? "No previous category" : "No next category"));
        }

        function activateSkillTab(tab, updateHash) {
            var nextIndex = skillTabs.indexOf(tab);
            var id = tab.getAttribute("data-skill-id");

            if (nextIndex < 0) {
                return;
            }

            var title = skillLabel(nextIndex);

            skillCurrentIndex = nextIndex;

            skillTabs.forEach(function (item) {
                var isActive = item === tab;
                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-selected", isActive ? "true" : "false");
                item.setAttribute("tabindex", isActive ? "0" : "-1");
            });

            skillPanels.forEach(function (panel) {
                panel.hidden = panel.getAttribute("data-skill-panel") !== id;
            });

            skillStatus.textContent = title + " summary selected";

            updateSkillStep(skillPrevious, nextIndex - 1, "previous");
            updateSkillStep(skillNext, nextIndex + 1, "next");

            if (skillNavQuery.matches) {
                tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
            }

            if (updateHash && window.history && window.history.replaceState) {
                window.history.replaceState(null, "", "#skills/" + id);
            }
        }

        function activateSkillFromHash(scrollToSection) {
            var match = window.location.hash.match(/^#skills\/([^/]+)$/);

            if (!match) {
                return;
            }

            var requestedId = decodeURIComponent(match[1]);
            var requestedTab = skillTabs.find(function (tab) {
                return tab.getAttribute("data-skill-id") === requestedId;
            });

            if (requestedTab) {
                activateSkillTab(requestedTab, false);

                if (scrollToSection) {
                    var skillsSection = document.getElementById("skills");
                    var navigationHeight = document.getElementById("navigation").offsetHeight;
                    window.scrollTo(0, Math.max(0, skillsSection.offsetTop - navigationHeight));
                }
            }
        }

        function updateSkillOrientation() {
            skillTabList.setAttribute("aria-orientation", skillNavQuery.matches ? "horizontal" : "vertical");
        }

        skillTabs.forEach(function (tab, index) {
            tab.addEventListener("click", function () {
                activateSkillTab(tab, true);
            });

            tab.addEventListener("keydown", function (event) {
                var nextIndex = index;
                var isHorizontal = skillNavQuery.matches;

                if (event.key === "Home") {
                    nextIndex = 0;
                } else if (event.key === "End") {
                    nextIndex = skillTabs.length - 1;
                } else if ((isHorizontal && event.key === "ArrowRight") || (!isHorizontal && event.key === "ArrowDown")) {
                    nextIndex = (index + 1) % skillTabs.length;
                } else if ((isHorizontal && event.key === "ArrowLeft") || (!isHorizontal && event.key === "ArrowUp")) {
                    nextIndex = (index - 1 + skillTabs.length) % skillTabs.length;
                } else {
                    return;
                }

                event.preventDefault();
                skillTabs[nextIndex].focus();
                activateSkillTab(skillTabs[nextIndex], true);
            });
        });

        [skillPrevious, skillNext].forEach(function (button) {
            button.addEventListener("click", function () {
                var targetIndex = parseInt(button.getAttribute("data-target-index"), 10);

                if (!Number.isNaN(targetIndex) && skillTabs[targetIndex]) {
                    skillTabs[targetIndex].focus();
                    activateSkillTab(skillTabs[targetIndex], true);
                }
            });
        });

        updateSkillOrientation();

        if (skillNavQuery.addEventListener) {
            skillNavQuery.addEventListener("change", updateSkillOrientation);
        } else {
            skillNavQuery.addListener(updateSkillOrientation);
        }

        window.addEventListener("hashchange", function () {
            activateSkillFromHash(true);
        });
        activateSkillFromHash(true);
        updateSkillStep(skillPrevious, skillCurrentIndex - 1, "previous");
        updateSkillStep(skillNext, skillCurrentIndex + 1, "next");
    }

});

/* -------------------------------------------------- original skill artwork */
document.addEventListener("DOMContentLoaded", function () {
    var svgMounts = Array.prototype.slice.call(document.querySelectorAll("[data-skills-svg-source]"));
    var sourceGroups = {};

    function decodeEmbeddedSource(encodedSource) {
        var binarySource = window.atob(encodedSource);
        var sourceBytes = new Uint8Array(binarySource.length);

        for (var byteIndex = 0; byteIndex < binarySource.length; byteIndex += 1) {
            sourceBytes[byteIndex] = binarySource.charCodeAt(byteIndex);
        }

        return new TextDecoder("utf-8").decode(sourceBytes);
    }

    function loadSourceHtml(source) {
        var embeddedSources = window.SKILLS_SOURCE_ARTWORK || {};

        if (Object.prototype.hasOwnProperty.call(embeddedSources, source)) {
            return Promise.resolve(decodeEmbeddedSource(embeddedSources[source]));
        }

        if (window.location.protocol === "file:") {
            return Promise.reject(new Error("Embedded skill artwork is missing for " + source));
        }

        return fetch(source).then(function (response) {
            if (!response.ok) {
                throw new Error("Unable to load " + source + ": " + response.status);
            }

            return response.text();
        });
    }

    function namespaceSvgIds(svg, prefix) {
        var idMap = {};

        svg.querySelectorAll("[id]").forEach(function (element) {
            var originalId = element.id;
            var namespacedId = prefix + originalId;
            idMap[originalId] = namespacedId;
            element.id = namespacedId;
        });

        svg.querySelectorAll("*").forEach(function (element) {
            Array.prototype.slice.call(element.attributes || []).forEach(function (attribute) {
                var nextValue = attribute.value;

                Object.keys(idMap).forEach(function (originalId) {
                    nextValue = nextValue.replace(new RegExp("#" + originalId + "\\b", "g"), "#" + idMap[originalId]);
                });

                if (nextValue !== attribute.value) {
                    element.setAttribute(attribute.name, nextValue);
                }
            });
        });

        svg.querySelectorAll("style").forEach(function (styleElement) {
            var cssText = styleElement.textContent;

            Object.keys(idMap).forEach(function (originalId) {
                cssText = cssText.replace(new RegExp("#" + originalId + "\\b", "g"), "#" + idMap[originalId]);
            });

            styleElement.textContent = cssText;
        });
    }

    function scopeSourceStyles(cssText, scopeSelector) {
        var wrapperSelectors = ["html", "body", ".artboard", ".frame"];

        cssText = cssText.replace(/<!\[CDATA\[|\]\]>/g, "");

        return cssText.replace(/([^{}]+)\{([^{}]*)\}/g, function (rule, selectorList, declarations) {
            var scopedSelectors = selectorList.split(",").map(function (selector) {
                selector = selector.trim();

                if (!selector || wrapperSelectors.indexOf(selector) !== -1) {
                    return "";
                }

                if (selector === ":root") {
                    return scopeSelector;
                }

                if (selector === "*") {
                    return scopeSelector + " *";
                }

                if (selector === "svg" || selector === ".frame > svg") {
                    return scopeSelector;
                }

                return scopeSelector + " " + selector;
            }).filter(Boolean);

            if (!scopedSelectors.length) {
                return "";
            }

            return scopedSelectors.join(", ") + " {" + declarations + "}";
        });
    }

    function mountSvg(sourceDocument, mount, mountIndex) {
        var sourceSvg = sourceDocument.querySelector("svg");

        if (!sourceSvg) {
            throw new Error("No SVG element found in " + mount.getAttribute("data-skills-svg-source"));
        }

        var svg = sourceSvg.cloneNode(true);
        var svgRootId = "skills-source-root-" + mountIndex;
        var sourceStyles = Array.prototype.map.call(sourceDocument.querySelectorAll("head style"), function (styleElement) {
            return styleElement.textContent;
        }).join("\n");

        if (sourceStyles) {
            var svgStyle = document.createElementNS("http://www.w3.org/2000/svg", "style");
            svgStyle.textContent = scopeSourceStyles(sourceStyles, "#" + svgRootId);
            svg.insertBefore(svgStyle, svg.firstChild);
        }

        svg.setAttribute("id", svgRootId);
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.removeAttribute("aria-labelledby");
        svg.setAttribute("viewBox", mount.getAttribute("data-skills-svg-view-box"));
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", mount.getAttribute("data-skills-svg-label"));
        svg.setAttribute("focusable", "false");
        namespaceSvgIds(svg, "skills-source-" + mountIndex + "-");
        mount.replaceChildren(svg);
        mount.setAttribute("data-skills-svg-state", "ready");
    }

    svgMounts.forEach(function (mount) {
        var source = mount.getAttribute("data-skills-svg-source");
        sourceGroups[source] = sourceGroups[source] || [];
        sourceGroups[source].push(mount);
    });

    Object.keys(sourceGroups).forEach(function (source, sourceIndex) {
        loadSourceHtml(source)
            .then(function (sourceHtml) {
                var sourceDocument = new DOMParser().parseFromString(sourceHtml, "text/html");
                sourceGroups[source].forEach(function (mount, mountIndex) {
                    mountSvg(sourceDocument, mount, sourceIndex + "-" + mountIndex);
                });
            })
            .catch(function (error) {
                sourceGroups[source].forEach(function (mount) {
                    mount.setAttribute("data-skills-svg-state", "error");
                });
                console.error(error);
            });
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
