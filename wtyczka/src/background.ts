/**
 * 🦍 76mikus SUPREME BACKGROUND v11.3.5
 * Handles dynamic network rules and telemetry blackout.
 */

const RULES = [
    {
        id: 1,
        priority: 1,
        action: {
            type: "modifyHeaders",
            responseHeaders: [
                { header: "content-security-policy", operation: "remove" },
                { header: "x-content-security-policy", operation: "remove" }
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
    }
];

const initSupremeRules = async () => {
    try {
        const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
        const oldRuleIds = oldRules.map(rule => rule.id);

        await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: oldRuleIds,
            // @ts-ignore
            addRules: RULES
        });
        console.log("[76mikus] Supreme Network Blackout Active.");
    } catch (e) {
        console.error("[76mikus] Rules sync failed:", e);
    }
};

chrome.runtime.onInstalled.addListener(initSupremeRules);
chrome.runtime.onStartup.addListener(initSupremeRules);

export { }
