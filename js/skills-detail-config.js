(function () {
    "use strict";

    window.SKILLS_DETAIL_DESIGN_CONFIG = {
        tokens: {
            pageTitle: { fontFamily: "'Open Sans','Segoe UI',Arial,sans-serif", fontSize: "72px", lineHeight: "1.02", fontWeight: "800", color: "var(--source-page-title)" },
            subtitle: { fontFamily: "'Open Sans','Segoe UI',Arial,sans-serif", fontSize: "36px", lineHeight: "1.14", fontWeight: "700", color: "var(--source-subtitle)" },
            boxTitle: { fontFamily: "'Open Sans','Segoe UI',Arial,sans-serif", fontSize: "32px", lineHeight: "1.15", fontWeight: "800", color: "var(--source-box-title)", background: "var(--source-title-bg)" },
            subBoxTitle: { fontFamily: "'Open Sans','Segoe UI',Arial,sans-serif", fontSize: "24px", lineHeight: "1.18", fontWeight: "800", color: "var(--source-subbox-title)", background: "var(--source-subtitle-bg)" },
            textHeader: { fontFamily: "'Open Sans','Segoe UI',Arial,sans-serif", fontSize: "22px", lineHeight: "1.22", fontWeight: "700", color: "var(--source-header)" },
            body: { fontFamily: "'Open Sans','Segoe UI',Arial,sans-serif", fontSize: "18px", lineHeight: "1.55", fontWeight: "400", color: "var(--source-text)" },
            label: { fontFamily: "'Open Sans','Segoe UI',Arial,sans-serif", fontSize: "14px", lineHeight: "1.3", fontWeight: "600", color: "var(--source-text)" }
        },
        textRoles: {
            pageTitle: ".skill-document-hero h2",
            subtitle: ".skill-document-subtitle",
            boxTitle: ".native-panel-title",
            subBoxTitle: ".native-subbox-title, .native-card h4, .terminal-guide h4, .workflow-reference h4, .training-notes h4, .project-delivery h4, .management-cycle-panel h4, .analysis-mosaic figcaption, .ai-mosaic figcaption, .evidence-grid figcaption",
            textHeader: ".native-card-eyebrow, .logo-card-grid h4, .tool-logo-grid h4",
            body: ".skill-document-lede, .panel-intro, .native-card p:not(.native-card-eyebrow), .terminal-guide p, .workflow-reference p, .training-notes p, .logo-card-grid p, .agentic-top-grid p, .tooling-split p",
            label: ".skill-kicker, .tag-list li, .skill-principles li, .communication-topics li, .process-flow b, .process-flow span, .mini-flow b, .mini-flow span, .agent-cycle b, .agent-cycle span, .icon-process li, .capability-grid li, .best-practice-grid li, .foundation-grid span, .compact-logo-row span, .tool-logo-grid span, .agent-tool-row span"
        },
        sourceTextRoles: {
            "engineering-expertise": {
                pageTitle: ".hero h1",
                subtitle: ".hero h2",
                boxTitle: ".panel-title",
                subBoxTitle: ".card-title, .delivery-principles span",
                textHeader: ".card-copy h4, .wf-step b, .impact-item strong",
                body: ".hero p, .card-copy p, .section-note, .wf-step span, .principle span",
                label: ".capability-line span, .tag-row span, .tags span"
            },
            "software-engineering": {
                pageTitle: ".hero h1",
                subtitle: ".hero h2",
                boxTitle: ".panel-title",
                subBoxTitle: ".subsection-title, .subpanel .panel-title",
                textHeader: ".language-card h3, .platform-copy h3, .quality-copy h3, .sub-copy h3, .automation-item strong, .capability-card strong, .vv-step strong, .lifecycle-step b, .lifecycle-practice strong",
                body: ".hero p, .language-card p, .platform-copy p, .quality-copy p, .sub-copy p, .section-note, .automation-item span, .check-list span, .check-list b, .capability-card span, .lifecycle-step span, .lifecycle-practice, .logo-tile span, .principle span",
                label: ".capability-line span, .tag-row span, .tags span"
            },
            "data-science": {
                pageTitle: ".hero h1",
                subtitle: ".hero h2",
                boxTitle: ".panel-title",
                subBoxTitle: ".card-title",
                textHeader: ".card-copy h4, .platform-item strong",
                body: ".hero p, .card-copy p, .principle span",
                label: ".capability-line span, .tag-row span, .tags span"
            },
            "deep-learning": {
                pageTitle: ".hero h1",
                subtitle: ".hero h2",
                boxTitle: ".panel-title",
                subBoxTitle: ".card-title",
                textHeader: ".card-copy h4",
                body: ".hero p, .card-copy p, .principle span",
                label: ".logo-tile span, .agentic-tool span"
            },
            "agentic-engineering-devops": {
                pageTitle: ".hero h1",
                subtitle: ".hero h2",
                boxTitle: ".panel-title",
                subBoxTitle: ".card-title",
                textHeader: ".card-copy h4",
                body: ".hero p, .card-copy p, .principle span",
                label: ".logo-tile span, .agentic-tool span"
            },
            "writing-communication": {
                pageTitle: ".hero h1",
                subtitle: ".hero h2",
                boxTitle: ".panel-title",
                subBoxTitle: ".card-title, .os-title",
                textHeader: ".card-copy h4, .text-box strong, .golden-command",
                body: ".hero p, .card-copy p, .principle span, .desc, .text-bullets div, .golden-sub, .funnel-caption",
                label: ".logo-tile span, .kbd, .cmd-line span"
            },
            "leadership-management": {
                pageTitle: ".hero h1",
                subtitle: ".hero h2",
                boxTitle: ".panel-title",
                subBoxTitle: ".card-title",
                textHeader: ".card-copy h4",
                body: ".hero p, .card-copy p, .principle span",
                label: ".logo-tile span"
            }
        },
        sectionRoles: {
            box: ".native-panel",
            subBox: ".native-card, .terminal-guide, .workflow-reference, .training-notes, .project-delivery, .management-cycle-panel"
        }
    };
}());
