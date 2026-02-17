/**
 * BRIDGE SCRIPT (ISOLATED WORLD)
 * Standard relay between MAIN world and Extension Environment.
 */
document.addEventListener('TP_INIT_ULTRA', () => {
    chrome.runtime.sendMessage({ type: "ACTIVATE_ULTRA_ENGINE" });
});
