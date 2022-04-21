let blockedUrls = [];

const updateBlockedUrls = () => {
    fetch("http://localhost:3000/all")
        .then((res) => res.json())
        .then((data) => {
            blockedUrls = data;
        });
};

setInterval(updateBlockedUrls, 5000);
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        const url = details.url;
        if (url.includes("http://localhost:3000/")) {
            return;
        }
        const blockedUrl = blockedUrls.find((blockedUrl) => {
            return url.includes(blockedUrl.url);
        });
        if (blockedUrl.upVotes > blockedUrl.downVotes) {
            return {
                cancel: true,
            };
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

// google.com
// google.com/search