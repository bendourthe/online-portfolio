(function () {
    "use strict";

    var detailRoot = document.querySelector("[data-skills-detail]");
    if (!detailRoot) {
        return;
    }

    var tabs = Array.prototype.slice.call(detailRoot.querySelectorAll(".skills-detail-tab"));
    var panels = Array.prototype.slice.call(detailRoot.querySelectorAll("[data-native-skill-panel]"));
    var status = detailRoot.querySelector("[data-detail-status]");
    var themeToggle = document.getElementById("theme-toggle-checkbox");
    var imageDialog = document.querySelector("[data-source-image-dialog]");
    var dialogImage = imageDialog ? imageDialog.querySelector("[data-source-dialog-image]") : null;
    var dialogCaption = imageDialog ? imageDialog.querySelector("[data-source-dialog-caption]") : null;
    var dialogClose = imageDialog ? imageDialog.querySelector("[data-source-dialog-close]") : null;
    var navigation = document.getElementById("navigation");

    function syncNavigationOffset() {
        if (navigation) {
            document.documentElement.style.setProperty("--skills-nav-height", navigation.offsetHeight + "px");
        }
    }

    syncNavigationOffset();
    if (navigation && typeof ResizeObserver === "function") {
        new ResizeObserver(syncNavigationOffset).observe(navigation);
    } else {
        window.addEventListener("resize", syncNavigationOffset, { passive: true });
    }

    var tabWrap = detailRoot.querySelector(".skills-detail-tabs-wrap");
    var detailHeading = detailRoot.querySelector(".skills-detail-heading");
    var detailLayout = document.createElement("div");
    var detailContent = document.createElement("div");
    detailLayout.className = "skills-detail-layout";
    detailContent.className = "skills-detail-content";
    if (tabWrap && detailHeading) {
        detailHeading.insertAdjacentElement("afterend", detailLayout);
        detailLayout.appendChild(tabWrap);
        detailLayout.appendChild(detailContent);
        panels.forEach(function (panel) { detailContent.appendChild(panel); });
        if (status) {
            detailContent.appendChild(status);
        }
    }

    function applySemanticDesignRoles() {
        var config = window.SKILLS_DETAIL_DESIGN_CONFIG;
        if (!config) {
            return;
        }

        Object.keys(config.textRoles || {}).forEach(function (role) {
            detailRoot.querySelectorAll(config.textRoles[role]).forEach(function (node) {
                node.setAttribute("data-skill-text-role", role);
            });
        });

        Object.keys(config.sectionRoles || {}).forEach(function (role) {
            detailRoot.querySelectorAll(config.sectionRoles[role]).forEach(function (node) {
                node.setAttribute("data-skill-section-role", role);
            });
        });
    }

    applySemanticDesignRoles();

    var selectorMedia = window.matchMedia("(max-width: 900px)");
    var tabList = tabWrap ? tabWrap.querySelector("[role='tablist']") : null;

    function syncTabOrientation() {
        if (tabList) {
            tabList.setAttribute("aria-orientation", selectorMedia.matches ? "horizontal" : "vertical");
        }
    }

    syncTabOrientation();
    if (typeof selectorMedia.addEventListener === "function") {
        selectorMedia.addEventListener("change", syncTabOrientation);
    } else if (typeof selectorMedia.addListener === "function") {
        selectorMedia.addListener(syncTabOrientation);
    }

    function imageCaption(img) {
        var labelledContainer = img.closest("article, figure, span, .native-card, .native-panel, .card, .panel, .tile, .item");
        var heading = labelledContainer ? labelledContainer.querySelector("h2, h3, h4, figcaption, b") : null;
        return (heading && heading.textContent.trim()) || img.alt || "Skill portfolio image";
    }

    function closeImageDialog() {
        if (!imageDialog) {
            return;
        }
        if (typeof imageDialog.close === "function") {
            imageDialog.close();
        } else {
            imageDialog.removeAttribute("open");
        }
    }

    function openImage(img) {
        if (!imageDialog || !dialogImage || !dialogCaption) {
            return;
        }
        dialogImage.src = img.currentSrc || img.src;
        dialogImage.alt = img.alt || "Expanded skill portfolio image";
        dialogCaption.textContent = imageCaption(img);
        if (typeof imageDialog.showModal === "function") {
            imageDialog.showModal();
        } else {
            imageDialog.setAttribute("open", "");
        }
    }

    function prepareImage(img) {
        if (img.dataset.expandablePrepared) {
            return;
        }
        if (img.naturalWidth < 360 || img.naturalHeight < 180) {
            return;
        }
        img.dataset.expandablePrepared = "true";
        img.setAttribute("tabindex", "0");
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", "Enlarge " + imageCaption(img));
    }

    var sourceHosts = [];
    var sourceResizers = {};
    var sourceResizeTimers = {};
    var sourceIntegrationCss = [
        ":host{color-scheme:dark;display:block;min-width:0;width:100%;--source-bg:transparent;--source-surface:#08232b;--source-surface-strong:#061d24;--source-surface-soft:#0d2d35;--source-title:#0a5660;--source-line:rgba(45,212,191,.34);--source-line-strong:rgba(34,211,238,.68);--source-accent:#2dd4bf;--source-accent-bright:#22d3ee;--source-text:#eaf6f8;--source-muted:#b6ccd1;--bg:transparent;--bg0:transparent;--bg1:#08232b;--panel:#08232b;--panel2:#0d2d35;--bar:#0a5660;--line:rgba(45,212,191,.34);--lineSoft:rgba(45,212,191,.2);--cyan:#2dd4bf;--cyan2:#22d3ee;--blue:#7dd3fc;--glow:#22d3ee;--text:#eaf6f8;--muted:#b6ccd1;--green:#5eead4}",
        ":host([data-theme='light']){color-scheme:light;--source-bg:transparent;--source-surface:#ffffff;--source-surface-strong:#ffffff;--source-surface-soft:#eef8f8;--source-title:#dff2f3;--source-line:rgba(0,127,131,.26);--source-line-strong:rgba(0,127,131,.54);--source-accent:#007f83;--source-accent-bright:#008f92;--source-text:#18343d;--source-muted:#4f6d75;--bg:transparent;--bg0:transparent;--bg1:#ffffff;--panel:#ffffff;--panel2:#eef8f8;--bar:#dff2f3;--line:rgba(0,127,131,.28);--lineSoft:rgba(0,127,131,.14);--cyan:#007f83;--cyan2:#008f92;--blue:#2574a9;--glow:#008f92;--text:#18343d;--muted:#4f6d75;--green:#007f83}",
        ".source-body{background:transparent!important;box-sizing:border-box;color:var(--source-text)!important;font-family:'Open Sans','Segoe UI',Arial,sans-serif!important;min-width:0;-webkit-font-smoothing:antialiased}",
        ".source-body :is(.page-content,.dashboard,.page){background:transparent!important;box-shadow:none!important;color:var(--source-text)!important}",
        ".source-body :is(.page-content,.dashboard,.page)::before,.source-body :is(.page-content,.dashboard,.page)::after{display:none!important}",
        ".source-body :is(h1,h2,h3,h4,h5,h6,p,li,span,small,b,strong,figcaption,.label,.ct,.cs,.title,.sub){text-shadow:none!important}",
        ".source-body :is(.panel-title,.section-title,.bar-title,.title-bar,.section-bar,.panel>h2,.panel>h3){background:var(--source-title)!important;border-color:var(--source-line)!important;color:var(--source-text)!important;text-shadow:none!important}",
        ".source-body :is(.hero h2,.hero .subtitle,.hero .subhead,.eyebrow,.kicker){color:var(--source-accent)!important;text-shadow:none!important}",
        ".source-body :is(.muted,.lede,.description,.copy,.caption){color:var(--source-muted)!important}",
        ".source-body .hero{background:linear-gradient(135deg,var(--source-surface-soft),var(--source-surface-strong))!important;border-color:var(--source-line-strong)!important}",
        ".source-body :is([class$='card'],[class*='card '],[class$='panel'],[class*='panel '],[class$='tile'],[class*='tile '],[class$='item'],[class*='item '],[class$='step'],[class*='step '],[class$='box'],[class*='box ']){background:var(--source-surface)!important;border-color:var(--source-line)!important;box-shadow:0 7px 20px rgba(0,0,0,.1)!important}",
        ".source-body .principle,.source-body .delivery-principles>span{background:var(--source-surface)!important;border-color:var(--source-line)!important;color:var(--source-text)!important;box-shadow:0 7px 20px rgba(0,0,0,.08)!important}",
        ".source-body .principle :is(strong,span),.source-body .delivery-principles>span{color:var(--source-text)!important;text-shadow:none!important}",
        ".source-body .principle svg{color:var(--source-accent-bright)!important}",
        ".source-fixed-holder,.source-fixed-stage{background:transparent!important}",
        ".source-fixed-holder{overflow:hidden;position:relative;width:100%}",
        ".source-fixed-stage{left:50%;position:absolute!important;top:0;transform-origin:top center!important}",
        ".source-fixed-stage>:is(.dashboard,.page,.page-content){inset:auto!important;margin:0 auto!important;position:relative!important;transform:none!important}",
        ".source-fixed-spacer{height:0;pointer-events:none;width:0}",
        ".source-fixed-holder.is-fluid-source-holder{height:auto!important;overflow:visible}",
        ".source-fixed-stage.is-fluid-source{left:auto!important;min-height:0!important;position:relative!important;transform:none!important;width:100%!important}",
        ".source-fixed-holder.is-scrollable-source-holder{overflow-x:auto;overflow-y:hidden;overscroll-behavior-inline:contain;scrollbar-color:var(--source-line) transparent;scrollbar-width:thin;touch-action:pan-x pan-y}",
        ".source-fixed-stage.is-scrollable-source{left:0!important;transform-origin:top left!important}",
        ":host([data-theme='light']) .source-body{color:var(--source-text)!important}",
        ":host([data-theme='light']) .source-body *:not(svg):not(svg *){color:var(--source-text)!important;text-shadow:none!important}",
        ":host([data-theme='light']) .source-body :is(h1,h2,h3,h4,h5,h6,p,li,span,small,b,strong,figcaption,.label,.ct,.cs,.title,.sub){color:var(--source-text)!important;text-shadow:none!important}",
        ":host([data-theme='light']) .source-body :is(.panel-title,.section-title,.bar-title,.title-bar,.section-bar,.panel>h2,.panel>h3){background:var(--source-title)!important;color:#075b67!important}",
        ":host([data-theme='light']) .source-body :is(.hero h2,.hero .subtitle,.hero .subhead,.eyebrow,.kicker){color:var(--source-accent)!important}",
        ":host([data-theme='light']) .source-body :is([class$='card'],[class*='card '],[class$='panel'],[class*='panel '],[class$='tile'],[class*='tile '],[class$='item'],[class*='item '],[class$='step'],[class*='step '],[class$='box'],[class*='box ']){background:var(--source-surface)!important;border-color:var(--source-line)!important;box-shadow:0 7px 20px rgba(16,62,69,.07)!important}",
        ":host([data-theme='light']) .source-body .principle,:host([data-theme='light']) .source-body .delivery-principles>span{background:#fff!important;border-color:var(--source-line)!important;box-shadow:0 7px 20px rgba(16,62,69,.07)!important}",
        ":host([data-theme='light']) .source-body :is(.muted,.lede,.description,.copy,.caption){color:var(--source-muted)!important}",
        ":host([data-theme='light']) .source-body svg text{fill:var(--source-text)!important;text-shadow:none!important}",
        "@media (min-width:801px){.source-body .hero h1,.source-body>.page>h1{font-size:56px!important;line-height:1.04!important}.source-body .panel-title{font-size:22px!important;line-height:1.15!important}}",
        ".source-body .hero{background:var(--source-surface-soft)!important;box-shadow:0 10px 30px rgba(0,0,0,.08)!important}",
        ".source-body :is(.page-section,.panel,.subpanel){background:var(--source-surface)!important;border-color:var(--source-line)!important}",
        ".source-body :is(.capability-line span,.tag-row span,.tags span,.pill,.chip){background:color-mix(in srgb,var(--source-accent) 14%,var(--source-surface))!important;border:1px solid var(--source-line)!important;color:var(--source-text)!important;box-shadow:none!important}",
        ":host([data-theme='light']) .source-body :is(.capability-line span,.tag-row span,.tags span,.pill,.chip){background:#dff2f3!important;border-color:#9bcfd2!important;color:#24515a!important}",
        ":host([data-skill-source='engineering-expertise']) .source-body .card-title,:host([data-skill-source='data-science']) .source-body .card-title{font-size:18px!important;line-height:1.15!important}",
        ":host([data-skill-source='engineering-expertise']) .source-body .card-copy h4{font-size:17px!important;line-height:1.22!important}",
        ":host([data-skill-source='software-engineering']) .source-body :is(.subsection-title,.subpanel .panel-title){font-size:18px!important;line-height:1.15!important}",
        ":host([data-skill-source='software-engineering']) .source-body :is(.platform-copy h3,.quality-copy h3,.sub-copy h3){font-size:18px!important;line-height:1.2!important}",
        ":host([data-theme='light'][data-skill-source='software-engineering']) .source-body :is(.subsection-title,.subpanel .panel-title),:host([data-theme='light'][data-skill-source='engineering-expertise']) .source-body .card-title,:host([data-theme='light'][data-skill-source='data-science']) .source-body .card-title{background:#dff2f3!important;color:#075b67!important}",
        ":host([data-theme='light'][data-skill-source='software-engineering']) .source-body :is(.branch-board,.platform-visual){background:#edf8f8!important}",
        ":host([data-theme='light'][data-skill-source='software-engineering']) .source-body .platform-visual img{filter:drop-shadow(0 8px 16px rgba(16,62,69,.12))!important}",
        ":host([data-theme='light'][data-skill-source='software-engineering']) .source-body .git-graph-nodes circle{fill:#ffffff!important}",
        ":host([data-theme='light'][data-skill-source='software-engineering']) .source-body .git-graph-nodes text{fill:#075b67!important;font-weight:600}",
        ":host([data-theme='light'][data-skill-source='software-engineering']) .source-body .github img{filter:invert(1)!important}",
        ":host([data-skill-source='deep-learning']) .source-body .panel,:host([data-skill-source='agentic-engineering-devops']) .source-body .panel,:host([data-skill-source='writing-communication']) .source-body .panel,:host([data-skill-source='leadership-management']) .source-body .panel{background:var(--source-surface)!important;border:1px solid var(--source-line)!important;box-shadow:0 8px 24px rgba(0,0,0,.08)!important}",
        ":host([data-skill-source='deep-learning']) .source-body .panel-title,:host([data-skill-source='agentic-engineering-devops']) .source-body .panel-title,:host([data-skill-source='writing-communication']) .source-body .panel-title,:host([data-skill-source='leadership-management']) .source-body .panel-title{background:var(--source-title)!important;color:var(--source-text)!important;font-size:22px!important;line-height:1.15!important}",
        ":host([data-skill-source='writing-communication']) .source-body #training>.panel-title{font-size:20px!important;letter-spacing:.35px!important;padding-inline:8px!important}",
        ":host([data-skill-source='leadership-management']) .source-body .cycle-footer{gap:3px!important;left:12px!important;right:12px!important}",
        ":host([data-skill-source='leadership-management']) .source-body .cycle-footer .mini{gap:3px!important;min-width:0!important;padding-inline:1px!important}",
        ":host([data-skill-source='leadership-management']) .source-body .cycle-footer .mini img{flex:0 0 34px!important;height:34px!important;width:34px!important}",
        ":host([data-skill-source='leadership-management']) .source-body .cycle-footer .mini span{font-size:10px!important;line-height:1.08!important;overflow-wrap:anywhere!important}",
        ":host([data-theme='light']) .source-body :is(.arch-body,.flow-cell,.med-body,.seg-body,.agentic-wrap,.cmd-card,.impact-body){background:#f4fafb!important}",
        "@media (min-width:801px){.source-body .hero h1,.source-body>.page>h1{font-size:56px!important;line-height:1.04!important}.source-body .panel-title{font-size:22px!important;line-height:1.15!important}}",
        "@media (max-width:760px){.source-body img{max-width:100%}.source-body :is(.page-content,.dashboard,.page){border-radius:0!important}}"
    ].join("\n");

sourceIntegrationCss = [
        ":host{color-scheme:dark;display:block;min-width:0;width:100%;--source-page-title:#f2fbfc;--source-subtitle:#34ddd0;--source-box-title:#f2fbfc;--source-subbox-title:#dff7f5;--source-header:#40c9ff;--source-text:#dcecef;--source-muted:#a9c2c8;--source-title-bg:linear-gradient(180deg,rgba(12,98,107,.98),rgba(5,52,62,.98));--source-subtitle-bg:linear-gradient(180deg,rgba(8,44,53,.98),rgba(4,29,38,.98));--source-line:rgba(52,221,208,.38);--source-pill-bg:rgba(52,221,208,.14);--source-pill-text:#dff7f5;--bg:#04171d;--bg0:#04171d;--bg1:#07242c;--panel:#07242c;--panel2:#0b3038;--bar:#0c626b;--line:rgba(52,221,208,.38);--lineSoft:rgba(52,221,208,.2);--cyan:#34ddd0;--cyan2:#40c9ff;--blue:#7db6ff;--glow:#40c9ff;--text:#dcecef;--muted:#a9c2c8;--green:#65e8c8;--source-accent-bright:#34ddd0}",
        ":host([data-theme='light']){color-scheme:light;--source-page-title:#17343d;--source-subtitle:#007f83;--source-box-title:#075b67;--source-subbox-title:#075b67;--source-header:#087ca7;--source-text:#294650;--source-muted:#58737a;--source-title-bg:linear-gradient(180deg,#e2f4f5,#cde7e9);--source-subtitle-bg:linear-gradient(180deg,#f6fbfc,#e4f2f3);--source-line:rgba(0,127,131,.28);--source-pill-bg:#e3f2f3;--source-pill-text:#24515a;--bg:#eef8f9;--bg0:#eef8f9;--bg1:#ffffff;--panel:#ffffff;--panel2:#f3fafb;--bar:#d8eff1;--line:rgba(0,127,131,.28);--lineSoft:rgba(0,127,131,.14);--cyan:#007f83;--cyan2:#087ca7;--blue:#2574a9;--glow:#008f92;--text:#294650;--muted:#58737a;--green:#007f83;--source-accent-bright:#075b67}",
        ".source-body{box-sizing:border-box;min-width:0;-webkit-font-smoothing:antialiased}",
        ".source-fixed-holder,.source-fixed-stage{background:transparent!important}",
        ".source-fixed-holder{overflow:hidden;position:relative;width:100%}",
        ".source-fixed-stage{left:50%;position:absolute!important;top:0;transform-origin:top center!important}",
        ".source-fixed-stage>:is(.dashboard,.page,.page-content){margin:0 auto!important;transform:none!important}",
        ".source-fixed-spacer{height:0;pointer-events:none;width:0}",
        ".source-fixed-holder.is-fluid-source-holder{height:auto!important;overflow:visible}",
        ".source-fixed-stage.is-fluid-source{left:auto!important;min-height:0!important;position:relative!important;transform:none!important;width:100%!important}",
        ".source-fixed-holder.is-scrollable-source-holder{overflow-x:auto;overflow-y:hidden;overscroll-behavior-inline:contain;scrollbar-color:var(--source-line) transparent;scrollbar-width:thin;touch-action:pan-x pan-y}",
        ".source-fixed-stage.is-scrollable-source{left:0!important;transform-origin:top left!important}",
        ".source-body [data-skill-text-role]{-webkit-text-fill-color:currentColor!important}",
        ".source-body [data-skill-text-role='pageTitle']{color:var(--source-page-title)!important;font-family:'Open Sans','Segoe UI',Arial,sans-serif!important;font-size:var(--skill-page-title-size)!important;font-weight:var(--skill-page-title-weight)!important;line-height:var(--skill-page-title-line)!important}",
        ".source-body [data-skill-text-role='subtitle']{color:var(--source-subtitle)!important;font-family:'Open Sans','Segoe UI',Arial,sans-serif!important;font-size:var(--skill-subtitle-size)!important;font-weight:var(--skill-subtitle-weight)!important;line-height:var(--skill-subtitle-line)!important}",
        ".source-body [data-skill-text-role='boxTitle']{background:var(--source-title-bg)!important;color:var(--source-box-title)!important;font-family:'Open Sans','Segoe UI',Arial,sans-serif!important;font-size:var(--skill-box-title-size)!important;font-weight:var(--skill-box-title-weight)!important;line-height:var(--skill-box-title-line)!important}",
        ".source-body [data-skill-text-role='subBoxTitle']{background:var(--source-subtitle-bg)!important;color:var(--source-subbox-title)!important;font-family:'Open Sans','Segoe UI',Arial,sans-serif!important;font-size:var(--skill-subbox-title-size)!important;font-weight:var(--skill-subbox-title-weight)!important;line-height:var(--skill-subbox-title-line)!important}",
        ".source-body [data-skill-text-role='textHeader']{color:var(--source-header)!important;font-family:'Open Sans','Segoe UI',Arial,sans-serif!important;font-size:var(--skill-text-header-size)!important;font-weight:var(--skill-text-header-weight)!important;line-height:var(--skill-text-header-line)!important}",
        ".source-body [data-skill-text-role='body']{color:var(--source-text)!important;font-family:'Open Sans','Segoe UI',Arial,sans-serif!important;font-size:var(--skill-body-size)!important;font-weight:var(--skill-body-weight)!important;line-height:var(--skill-body-line)!important}",
        ".source-body [data-skill-text-role='label']{color:var(--source-text)!important;font-family:'Open Sans','Segoe UI',Arial,sans-serif!important;font-size:var(--skill-label-size)!important;font-weight:var(--skill-label-weight)!important;line-height:var(--skill-label-line)!important}",
        ".source-body :is(.capability-line span,.tag-row span,.tags span,.pill,.chip){background:var(--source-pill-bg)!important;border-color:var(--source-line)!important;color:var(--source-pill-text)!important}",
        ":host([data-theme='light']) .source-body :is(.hero,.page-content,.dashboard,.page){color:var(--source-text)!important}",
        ":host([data-theme='light']) .source-body [data-skill-text-role]{text-shadow:none!important}",
        ":host([data-theme='light']) .source-body{background:transparent!important}",
        ":host([data-theme='light']) .source-body::before,:host([data-theme='light']) .source-body::after{display:none!important}",
        ":host([data-theme='light']) .source-body>var{display:none!important}",
        ":host([data-theme='light'][data-skill-source='software-engineering']) .source-body :is(.branch-board,.platform-visual){background:#edf8f9!important}",
        ":host([data-theme='light'][data-skill-source='software-engineering']) .source-body .git-graph-nodes circle{fill:#ffffff!important}",
        ":host([data-theme='light'][data-skill-source='software-engineering']) .source-body .git-graph-nodes text{fill:#075b67!important;font-weight:600}",
        ":host([data-theme='light'][data-skill-source='software-engineering']) .source-body .github img{filter:invert(1)!important}",
        ":host([data-theme='light']) .source-body>:is(.dashboard,.page){background:transparent!important}",
        ":host([data-theme='light']) .source-body>:is(.dashboard,.page)::before{opacity:.12!important}",
        ":host([data-theme='light']) .source-body>:is(.dashboard,.page)::after{display:none!important}",
        ":host([data-theme='light']) .source-body :is([class$='card'],[class*='card '],[class$='panel'],[class*='panel '],[class$='tile'],[class*='tile '],[class$='item'],[class*='item '],[class$='step'],[class*='step '],[class$='box'],[class*='box '],.principle,.best,.foundations,.strategy-body,.delivery-body,.platform-visual){background:var(--panel)!important;border-color:var(--source-line)!important;color:var(--source-text)!important;box-shadow:0 8px 22px rgba(28,84,93,.08)!important}",
        ".source-body .principle{background:var(--source-surface)!important;border:1px solid var(--source-line)!important;border-radius:12px!important;padding:24px 16px!important;box-sizing:border-box!important;box-shadow:0 7px 20px rgba(0,0,0,.08)!important}",
        ".source-body .principle svg, .source-body .principle img{width:78px!important;height:78px!important;object-fit:contain!important;margin-bottom:6px!important}",
        ".source-body .principle svg{color:var(--source-accent-bright)!important;filter:drop-shadow(0 1px 3px rgba(30,145,230,.3))!important}",
        ".source-body .principle :is(strong, span){color:var(--source-header)!important;text-shadow:none!important}",
        ".source-body .principle strong, .source-body .principle span:only-of-type {font-size:22px!important;font-weight:700!important}",
        ".source-body .principle strong + span {font-size:16px!important;font-weight:400!important;color:var(--source-text)!important;margin-top:8px!important}",
        ":host([data-theme='light']) .source-body .principle{background:#fff!important;border-color:var(--source-line)!important;box-shadow:0 7px 20px rgba(16,62,69,.07)!important}",
        ":host([data-theme='light']) .source-body .principle svg{color:#075b67!important;filter:none!important}",
        ":host(:not([data-theme='light'])) .source-body .principle svg{color:#34ddd0!important}",

        ":host([data-theme='light'][data-skill-source='deep-learning']) .source-body :is(.arch-body,.flow-cell,.med-body,.seg-body){background:#f4fafb!important}",
        ":host([data-theme='light'][data-skill-source='agentic-engineering-devops']) .source-body :is(.panel-body,.core-body,.agentic-body,.devops-body,.ops-body){background:transparent!important}",
        ":host([data-theme='light'][data-skill-source='writing-communication']) .source-body :is(.panel-body,.doc-body,.science-body,.training-body,.impact-body){background:transparent!important}",
        ":host([data-layout='vertical']) .source-body{min-height:0!important}",
        ":host([data-layout='vertical']) .source-body>.dashboard,:host([data-layout='vertical']) .source-body>.page{box-sizing:border-box!important;height:auto!important;min-height:0!important;overflow:visible!important}",

        ":host([data-skill-source='deep-learning'][data-layout='vertical']) .source-body>.dashboard{display:grid!important;gap:12px!important;grid-template-areas:'hero hero' 'arch arch' 'landmark super' 'medseg flow' 'object stock' 'semantic instance' 'workflow workflow'!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;padding:12px!important;position:relative!important;width:1536px!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) .dashboard>.hero{grid-area:hero!important;height:104px!important;inset:auto!important;position:relative!important;width:auto!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) .dashboard>.panel{inset:auto!important;min-height:0!important;position:relative!important;width:auto!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) #landmark{grid-area:landmark!important;height:300px!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) #medseg{grid-area:medseg!important;height:380px!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) #object{grid-area:object!important;height:430px!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) #arch{grid-area:arch!important;height:620px!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) #semantic{grid-area:semantic!important;height:390px!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) #instance{grid-area:instance!important;height:390px!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) #super{grid-area:super!important;height:300px!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) #flow{grid-area:flow!important;height:380px!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) #stock{grid-area:stock!important;height:430px!important}",
        ":host([data-skill-source='deep-learning'][data-layout='vertical']) #workflow{grid-area:workflow!important;height:190px!important}",

        ":host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .source-body>.dashboard{display:block!important;padding:12px!important;position:relative!important;width:1536px!important}",
        ":host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .dashboard>.hero{height:94px!important}",
        ":host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .dashboard>.main{display:flex!important;flex-direction:column!important;gap:12px!important;margin:0 auto!important;width:1508px!important}",
        ":host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .top-grid,:host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .bottom-grid{display:contents!important}",
        ":host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .top-grid>.panel,:host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .bottom-grid>.panel,:host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .best-panel{margin:0!important;min-height:0!important;width:100%!important}",
        ":host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .top-grid>.panel{height:426px!important}",
        ":host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .bottom-grid>.panel{height:300px!important}",
        ":host([data-skill-source='agentic-engineering-devops'][data-layout='vertical']) .best-panel{height:174px!important}",

        ":host([data-skill-source='writing-communication'][data-layout='vertical']) .source-body>.dashboard{display:flex!important;flex-direction:column!important;gap:12px!important;padding:12px 8px!important;position:relative!important;width:2048px!important}",
        ":host([data-skill-source='writing-communication'][data-layout='vertical']) .dashboard>.hero{height:112px!important;inset:auto!important;position:relative!important;width:2032px!important}",
        ":host([data-skill-source='writing-communication'][data-layout='vertical']) .dashboard>.panel{inset:auto!important;margin:0!important;min-height:0!important;position:relative!important;width:2032px!important}",
        ":host([data-skill-source='writing-communication'][data-layout='vertical']) #nav{height:76px!important}",
        ":host([data-skill-source='writing-communication'][data-layout='vertical']) #doc{height:747px!important}",
        ":host([data-skill-source='writing-communication'][data-layout='vertical']) #science{height:747px!important}",
        ":host([data-skill-source='writing-communication'][data-layout='vertical']) #training{height:747px!important}",
        ":host([data-skill-source='writing-communication'][data-layout='vertical']) #impact{height:164px!important}",

        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .source-body>.page{display:flex!important;flex-direction:column!important;gap:12px!important;padding:12px 10px 16px!important;position:relative!important;width:1448px!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .page>.layout,:host([data-skill-source='leadership-management'][data-layout='vertical']) .layout>.middle{display:contents!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .foundations,:host([data-skill-source='leadership-management'][data-layout='vertical']) .strategy-panel,:host([data-skill-source='leadership-management'][data-layout='vertical']) .delivery-panel,:host([data-skill-source='leadership-management'][data-layout='vertical']) .cycle-panel,:host([data-skill-source='leadership-management'][data-layout='vertical']) .best{margin:0!important;min-height:0!important;width:1418px!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .foundations{height:1185px!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .foundations-embed{height:1147px!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .skills-frame-wrap{height:1140px!important;width:780px!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .skills-frame{transform:scale(2.5)!important;transform-origin:top left!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .strategy-panel{height:540px!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .strategy-body{margin:0 auto!important;transform:scale(1.7)!important;transform-origin:top center!important;width:58.8235%!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .delivery-panel{height:430px!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .delivery-body{margin:0 auto!important;transform:scale(1.7)!important;transform-origin:top center!important;width:58.8235%!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .cycle-panel{height:1100px!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .cycle-wrap{height:1062px!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .cycle-frame-wrap{height:966px!important;width:835px!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .cycle-frame{transform:scale(2.3)!important;transform-origin:top left!important}",
        ":host([data-skill-source='leadership-management'][data-layout='vertical']) .best{height:auto!important}",
        "@media(max-width:800px){:host([data-layout='vertical']) .source-body{--skill-page-title-responsive:clamp(2.35rem,10vw,4rem);--skill-subtitle-responsive:clamp(1.45rem,6vw,2.25rem);--skill-box-title-responsive:clamp(1.35rem,5.2vw,2rem);--skill-sub-box-title-responsive:clamp(1.15rem,4.6vw,1.625rem);--skill-text-header-responsive:clamp(1rem,4vw,1.35rem);--skill-body-responsive:clamp(.94rem,3.7vw,1.125rem);--skill-label-responsive:clamp(.75rem,3vw,.875rem)}}"
].join("\n");

    function applySourceDesignRoles(sourceBody, skillId) {
        var config = window.SKILLS_DETAIL_DESIGN_CONFIG;
        if (!config || !config.sourceTextRoles || !config.sourceTextRoles[skillId]) {
            return;
        }
        Object.keys(config.sourceTextRoles[skillId]).forEach(function (role) {
            sourceBody.querySelectorAll(config.sourceTextRoles[skillId][role]).forEach(function (element) {
                var token = config.tokens && config.tokens[role];
                var prefix = "--skill-" + role.replace(/[A-Z]/g, function (letter) { return "-" + letter.toLowerCase(); });
                element.dataset.skillTextRole = role;
                if (!token) {
                    return;
                }
                element.style.setProperty("font-family", token.fontFamily, "important");
                element.style.setProperty("font-size", "var(" + prefix + "-responsive,var(" + prefix + "-size))", "important");
                element.style.setProperty("font-weight", "var(" + prefix + "-weight)", "important");
                element.style.setProperty("line-height", "var(" + prefix + "-line)", "important");
                element.style.setProperty("color", token.color, "important");
                element.style.setProperty("-webkit-text-fill-color", "currentColor", "important");
                if (token.background) {
                    element.style.setProperty("background", token.background, "important");
                }
            });
        });
    }

    function applySourceDesignTokens(host) {
        var config = window.SKILLS_DETAIL_DESIGN_CONFIG;
        if (!config || !config.tokens) {
            return;
        }
        Object.keys(config.tokens).forEach(function (role) {
            var token = config.tokens[role];
            var prefix = "--skill-" + role.replace(/[A-Z]/g, function (letter) { return "-" + letter.toLowerCase(); });
            host.style.setProperty(prefix + "-size", token.fontSize);
            host.style.setProperty(prefix + "-line", token.lineHeight);
            host.style.setProperty(prefix + "-weight", token.fontWeight);
        });
    }

    function embeddedThemeCss(dark) {
        return dark
            ? "html,body{background:transparent!important;color:#eaf6f8!important}body>*{background:transparent!important}.card,.panel,.item,.tile,.box{background:#0a252c!important;border-color:rgba(45,212,191,.35)!important;color:#eaf6f8!important}h1,h2,h3,h4,p,span,b,small,.label{color:#eaf6f8!important;text-shadow:none!important}"
            : "html,body{background:transparent!important;color:#18343d!important}body>*{background:transparent!important}.card,.panel,.item,.tile,.box{background:#fff!important;border-color:rgba(0,127,131,.28)!important;color:#18343d!important;box-shadow:0 6px 18px rgba(16,62,69,.07)!important}h1,h2,h3,h4,p,span,b,small,.label{color:#18343d!important;text-shadow:none!important}";
    }

    function syncEmbeddedFrames(host) {
        var dark = host.dataset.theme === "dark";
        if (!host.shadowRoot) {
            return;
        }
        host.shadowRoot.querySelectorAll("iframe").forEach(function (frame) {
            function applyFrameTheme() {
                try {
                    var doc = frame.contentDocument;
                    if (!doc || !doc.head) {
                        return;
                    }
                    var style = doc.getElementById("portfolio-frame-theme");
                    if (!style) {
                        style = doc.createElement("style");
                        style.id = "portfolio-frame-theme";
                        doc.head.appendChild(style);
                    }
                    style.textContent = embeddedThemeCss(dark);
                } catch (error) {
                    return;
                }
            }
            frame.addEventListener("load", applyFrameTheme, { once: true });
            applyFrameTheme();
        });
    }

    function bindSourceImages(shadowRoot) {
        shadowRoot.querySelectorAll("img").forEach(function (img) {
            if (img.complete) {
                prepareImage(img);
            } else {
                img.addEventListener("load", function () { prepareImage(img); }, { once: true });
            }
        });
        shadowRoot.addEventListener("click", function (event) {
            var img = event.target.closest && event.target.closest("img[role='button']");
            if (img) {
                openImage(img);
            }
        });
        shadowRoot.addEventListener("keydown", function (event) {
            var img = event.target.closest && event.target.closest("img[role='button']");
            if (img && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                openImage(img);
            }
        });
    }

    function mountSourcePanel(panel, source) {
        var host = document.createElement("div");
        host.className = "skills-source-host";
        host.dataset.skillSource = panel.dataset.nativeSkillPanel;
        host.dataset.layout = source.vertical ? "vertical" : source.layout;
        host.dataset.theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
        applySourceDesignTokens(host);
        var defaultPageTitleSize = host.style.getPropertyValue("--skill-page-title-size");
        host.setAttribute("aria-label", source.label + " detailed portfolio");
        var shadow = host.attachShadow({ mode: "open" });
        var style = document.createElement("style");
        style.textContent = source.css + "\n" + sourceIntegrationCss;
        shadow.appendChild(style);

        var sourceBody = document.createElement("div");
        sourceBody.className = "source-body";
        sourceBody.innerHTML = source.html;
        applySourceDesignRoles(sourceBody, panel.dataset.nativeSkillPanel);

        if (source.layout === "fixed") {
            var holder = document.createElement("div");
            holder.className = "source-fixed-holder";
            sourceBody.classList.add("source-fixed-stage");
            sourceBody.style.width = source.width + "px";
            sourceBody.style.minHeight = source.vertical ? "0" : source.height + "px";
            holder.appendChild(sourceBody);
            var spacer = document.createElement("div");
            spacer.className = "source-fixed-spacer";
            holder.appendChild(spacer);
            shadow.appendChild(holder);
            var measuredSourceHeight = source.vertical ? 0 : source.height;
            var measureSourceHeight = function () {
                var sourceDocument = sourceBody.firstElementChild;
                measuredSourceHeight = Math.max(
                    source.vertical ? 0 : source.height,
                    sourceBody.scrollHeight,
                    sourceBody.offsetHeight,
                    sourceDocument ? sourceDocument.scrollHeight : 0,
                    sourceDocument ? sourceDocument.offsetHeight : 0
                );
                return measuredSourceHeight;
            };
            var resizeSource = function () {
                var availableWidth = host.clientWidth;
                if (!availableWidth) {
                    return;
                }
                if (host.dataset.skillSource === "deep-learning") {
                    host.style.setProperty("--skill-page-title-size", availableWidth <= 520 ? "34px" : defaultPageTitleSize);
                }
                var documentHeight = measureSourceHeight();
                if (source.responsive && source.mobileFluid !== false && availableWidth <= 800) {
                    holder.classList.add("is-fluid-source-holder");
                    sourceBody.classList.add("is-fluid-source");
                    sourceBody.style.width = "100%";
                    sourceBody.style.minHeight = "0";
                    sourceBody.style.transform = "none";
                    holder.style.height = "auto";
                    return;
                }
                holder.classList.remove("is-fluid-source-holder");
                sourceBody.classList.remove("is-fluid-source");
                sourceBody.style.width = source.width + "px";
                sourceBody.style.minHeight = documentHeight + "px";
                var fitScale = Math.min(1, availableWidth / source.width);
                var isScrollable = !source.responsive && availableWidth <= 900 && fitScale < 0.62;
                var scale = isScrollable ? 0.62 : fitScale;
                holder.classList.toggle("is-scrollable-source-holder", isScrollable);
                sourceBody.classList.toggle("is-scrollable-source", isScrollable);
                if (isScrollable) {
                    holder.setAttribute("tabindex", "0");
                    holder.setAttribute("aria-label", "Scroll horizontally to explore the complete " + source.label + " visual");
                } else {
                    holder.removeAttribute("tabindex");
                    holder.removeAttribute("aria-label");
                }
                sourceBody.style.transform = (isScrollable ? "scale(" : "translateX(-50%) scale(") + scale + ")";
                spacer.style.width = isScrollable ? Math.ceil(source.width * scale) + "px" : "0";
                spacer.style.height = isScrollable ? Math.ceil(documentHeight * scale) + "px" : "0";
                holder.style.height = Math.ceil(documentHeight * scale) + "px";
            };
            sourceResizers[panel.dataset.nativeSkillPanel] = resizeSource;
            if (typeof ResizeObserver === "function") {
                new ResizeObserver(resizeSource).observe(host);
            } else {
                window.addEventListener("resize", resizeSource, { passive: true });
            }
            sourceBody.querySelectorAll("img").forEach(function (img) {
                if (!img.complete) {
                    img.addEventListener("load", function () { window.requestAnimationFrame(resizeSource); }, { once: true });
                }
            });
            if (document.fonts && document.fonts.ready) {
                document.fonts.ready.then(function () { window.requestAnimationFrame(resizeSource); });
            }
            window.requestAnimationFrame(resizeSource);
        } else {
            shadow.appendChild(sourceBody);
        }

        bindSourceImages(shadow);
        panel.replaceChildren(host);
        panel.classList.add("is-source-mounted");
        sourceHosts.push(host);
        syncEmbeddedFrames(host);
    }

    if (window.SKILLS_DETAIL_SOURCE) {
        panels.forEach(function (panel) {
            var source = window.SKILLS_DETAIL_SOURCE[panel.dataset.nativeSkillPanel];
            if (source) {
                mountSourcePanel(panel, source);
            }
        });
    }

    panels.forEach(function (panel) {
        panel.querySelectorAll("img").forEach(function (img) {
            if (img.complete) {
                prepareImage(img);
            } else {
                img.addEventListener("load", function () { prepareImage(img); }, { once: true });
            }
        });
    });

    detailRoot.addEventListener("click", function (event) {
        var img = event.target.closest("img[role='button']");
        if (img) {
            openImage(img);
        }
    });

    detailRoot.addEventListener("keydown", function (event) {
        var img = event.target.closest("img[role='button']");
        if (img && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openImage(img);
        }
    });

    function syncThemeMetadata() {
        var dark = document.body.classList.contains("dark-mode");
        sourceHosts.forEach(function (host) {
            host.dataset.theme = dark ? "dark" : "light";
            syncEmbeddedFrames(host);
        });
        var themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.content = dark ? "#04141a" : "#f3fafb";
        }
        Object.keys(sourceResizers).forEach(function (skillId) {
            scheduleSourceResize(skillId);
        });
    }

    function scheduleSourceResize(skillId) {
        var resizeSource = sourceResizers[skillId];
        if (!resizeSource) {
            return;
        }
        window.requestAnimationFrame(resizeSource);
        window.clearTimeout(sourceResizeTimers[skillId]);
        sourceResizeTimers[skillId] = window.setTimeout(resizeSource, 90);
    }

    function activateSkill(skillId, options) {
        if (tabWrap) {
            tabWrap.classList.remove("is-dropdown-open");
        }
        options = options || {};
        var activeTab = tabs.find(function (tab) { return tab.dataset.skillId === skillId; }) || tabs[0];
        if (!activeTab) {
            return;
        }
        skillId = activeTab.dataset.skillId;

        tabs.forEach(function (tab) {
            var active = tab === activeTab;
            tab.classList.toggle("is-active", active);
            tab.setAttribute("aria-selected", String(active));
            tab.tabIndex = active ? 0 : -1;
        });

        var activePanel = null;
        panels.forEach(function (panel) {
            var active = panel.dataset.nativeSkillPanel === skillId;
            panel.hidden = !active;
            if (active) {
                activePanel = panel;
            }
        });

        if (options.focus) {
            activeTab.focus();
        }
        if (options.updateHash && window.location.hash !== "#" + skillId) {
            window.history.replaceState(null, "", "#" + skillId);
        }
        if (status) {
            status.textContent = activeTab.textContent.trim() + " selected";
        }
        if (options.scroll && activePanel) {
            var navHeight = navigation ? navigation.offsetHeight : 76;
            var isSticky = tabWrap && getComputedStyle(tabWrap).position === "sticky";
            var offset = (isSticky ? tabWrap.offsetHeight + 16 : 0) + navHeight;
            var top = activePanel.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
        if (activePanel && sourceResizers[skillId]) {
            scheduleSourceResize(skillId);
        }
    }

    tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () {
            if (tab.classList.contains("is-active")) {
                if (tabWrap) {
                    tabWrap.classList.toggle("is-dropdown-open");
                }
            } else {
                activateSkill(tab.dataset.skillId, { updateHash: true, scroll: true });
            }
        });
        tab.addEventListener("keydown", function (event) {
            var nextIndex = index;
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                nextIndex = (index + 1) % tabs.length;
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                nextIndex = (index - 1 + tabs.length) % tabs.length;
            } else if (event.key === "Home") {
                nextIndex = 0;
            } else if (event.key === "End") {
                nextIndex = tabs.length - 1;
            } else {
                return;
            }
            event.preventDefault();
            activateSkill(tabs[nextIndex].dataset.skillId, { focus: true, updateHash: true, scroll: true });
        });
    });

    if (themeToggle) {
        themeToggle.checked = !document.body.classList.contains("dark-mode");
        themeToggle.addEventListener("change", function () {
            document.body.classList.toggle("dark-mode", !themeToggle.checked);
            window.localStorage.setItem("portfolio-theme", themeToggle.checked ? "light" : "dark");
            syncThemeMetadata();
        });
    }

    if (dialogClose) {
        dialogClose.addEventListener("click", closeImageDialog);
    }
    if (imageDialog) {
        imageDialog.addEventListener("click", function (event) {
            if (event.target === imageDialog) {
                closeImageDialog();
            }
        });
    }

    window.addEventListener("hashchange", function () {
        activateSkill(window.location.hash.slice(1), { updateHash: false, scroll: true });
    });

    syncThemeMetadata();
    activateSkill(window.location.hash.slice(1) || tabs[0].dataset.skillId, { updateHash: false, scroll: false });

    var canvas = document.getElementById("constellation");
    if (canvas && canvas.getContext) {
        var context = canvas.getContext("2d");
        var particles = [];
        var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function resizeCanvas() {
            var ratio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(window.innerWidth * ratio);
            canvas.height = Math.floor(window.innerHeight * ratio);
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            var count = Math.max(32, Math.floor(window.innerWidth / 34));
            particles = Array.from({ length: count }, function () {
                return { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12 };
            });
        }

        function drawConstellation() {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            var dark = document.body.classList.contains("dark-mode");
            particles.forEach(function (particle, index) {
                if (!reducedMotion) {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    if (particle.x < 0 || particle.x > window.innerWidth) { particle.vx *= -1; }
                    if (particle.y < 0 || particle.y > window.innerHeight) { particle.vy *= -1; }
                }
                context.fillStyle = dark ? "rgba(45,212,191,.32)" : "rgba(0,113,115,.22)";
                context.beginPath();
                context.arc(particle.x, particle.y, 1.25, 0, Math.PI * 2);
                context.fill();
                for (var next = index + 1; next < particles.length; next += 1) {
                    var other = particles[next];
                    var distance = Math.hypot(particle.x - other.x, particle.y - other.y);
                    if (distance < 105) {
                        context.strokeStyle = dark ? "rgba(45,212,191," + (0.08 * (1 - distance / 105)) + ")" : "rgba(0,113,115," + (0.08 * (1 - distance / 105)) + ")";
                        context.beginPath();
                        context.moveTo(particle.x, particle.y);
                        context.lineTo(other.x, other.y);
                        context.stroke();
                    }
                }
            });
            if (!reducedMotion) {
                window.requestAnimationFrame(drawConstellation);
            }
        }

        resizeCanvas();
        drawConstellation();
        window.addEventListener("resize", resizeCanvas, { passive: true });
    }
})();
