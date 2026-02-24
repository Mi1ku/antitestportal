/**
 * 🦍 mi1ku SUPREME BACKGROUND v11.4.0 (Side Dock Enabled)
 * Handles dynamic network rules (DNR) to unlock iframes & block tracking.
 */

const RULES: any[] = [
    {
        id: 1,
        priority: 1,
        action: {
            type: "modifyHeaders",
            responseHeaders: [
                { header: "content-security-policy", operation: "remove" },
                { header: "x-content-security-policy", operation: "remove" },
                { header: "x-webkit-csp", operation: "remove" },
                { header: "content-security-policy-report-only", operation: "remove" }
            ]
        },
        condition: {
            urlFilter: "testportal",
            resourceTypes: ["main_frame", "sub_frame"]
        }
    },
    {
        id: 2,
        priority: 10,
        action: { type: "block" },
        condition: {
            urlFilter: "*testportal*cheat*",
            resourceTypes: ["xmlhttprequest", "ping", "script", "other"]
        }
    },
    {
        id: 3,
        priority: 10,
        action: { type: "block" },
        condition: {
            urlFilter: "*testportal*focus*",
            resourceTypes: ["xmlhttprequest", "ping", "script", "other"]
        }
    },
    {
        id: 4,
        priority: 10,
        action: { type: "block" },
        condition: {
            urlFilter: "*testportal*trace*",
            resourceTypes: ["xmlhttprequest", "ping", "script", "other"]
        }
    },
    // --- IFRAME UNLOCKERS ---
    {
        id: 5,
        priority: 20,
        action: {
            type: "modifyHeaders",
            responseHeaders: [
                { header: "x-frame-options", operation: "remove" },
                { header: "frame-options", operation: "remove" },
                { header: "content-security-policy", operation: "remove" },
                { header: "x-content-security-policy", operation: "remove" }
            ]
        },
        condition: {
            urlFilter: "perplexity.ai",
            resourceTypes: ["sub_frame", "xmlhttprequest"]
        }
    },
    {
        id: 6,
        priority: 20,
        action: {
            type: "modifyHeaders",
            responseHeaders: [
                { header: "x-frame-options", operation: "remove" },
                { header: "frame-options", operation: "remove" },
                { header: "content-security-policy", operation: "remove" },
                { header: "x-content-security-policy", operation: "remove" }
            ]
        },
        condition: {
            urlFilter: "google.com",
            resourceTypes: ["sub_frame", "xmlhttprequest"]
        }
    }
];

const initSupremeRules = async () => {
    try {
        const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
        const oldRuleIds = oldRules.map(rule => rule.id);

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: oldRuleIds,
            addRules: RULES
        });
        console.log("[mi1ku] Supreme Network Rules Sync Complete.");
    } catch (e) {
        console.error("[mi1ku] Rules sync error:", e);
    }
};

chrome.runtime.onInstalled.addListener(initSupremeRules);
chrome.runtime.onStartup.addListener(initSupremeRules);



export const handler = async (req, res) => {
    // Plasmo standard handler
}
