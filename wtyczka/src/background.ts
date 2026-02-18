import { Storage } from "@plasmohq/storage"
import { PluginConfigKey, type PluginConfig } from "~hooks/use-plugin-config";

/**
 * 🦍 76mikus SUPREME BACKGROUND v11.3.8
 * Handles dynamic network rules & FETCH_IMAGE requests.
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

// --- USER REQUESTED CONTENT (FETCH_IMAGE) ---
// This handles cross-origin image fetching for the auto-solve engine
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "FETCH_IMAGE") {
        fetch(request.url)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    sendResponse({ data: reader.result, success: true });
                };
                reader.onerror = () => {
                    sendResponse({ success: false, error: "Failed to read blob" });
                }
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                sendResponse({ success: false, error: error.toString() });
            });

        return true; // Keep channel open for async response
    }

    // --- 76mikus SUPREME SCREENSHOT ENGINE ---
    if (request.type === "CAPTURE_SCREENSHOT") {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
            if (chrome.runtime.lastError) {
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
                sendResponse({ success: true, dataUrl: dataUrl });
            }
        });
        return true; // Keep channel open
    }
});

export const handler = async (req, res) => {
    // Plasmo standard handler
}
