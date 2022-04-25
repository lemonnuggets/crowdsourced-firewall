const serverUrl = "http://localhost:3000";
let blockedUrls = [];

const updateBlockedUrls = () => {
    fetch(`${serverUrl}/allBlocked`)
        .then((res) => {
            console.log(res);
            return res.json();
        })
        .then((data) => {
            blockedUrls = data;
        })
        .catch((err) => console.log(err));
};
setInterval(updateBlockedUrls, 5000);

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        const url = details.url;
        if (url.includes(serverUrl)) {
            return;
        }
        const blockedUrl = blockedUrls.find((blockedUrl) => {
            return url.includes(blockedUrl.url);
        });
        if (blockedUrl) {
            return {
                cancel: true,
            };
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);
