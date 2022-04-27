const serverUrl = "http://localhost:3000";
document.querySelector(".reportBtn").addEventListener("click", () => {
    const url = document.querySelector("#urlInput").value;
    fetch(`${serverUrl}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            url,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(`${url} reported`, data);
            document.querySelector("#urlInput").value = "";
        })
        .catch((err) => console.log(err));
});

const attachEventListeners = () => {
    document.querySelectorAll(".itemRow").forEach((row) => {
        console.log(row, row.querySelector(".itemUpvote img"));
        row.querySelector(".itemUpvote img").addEventListener("click", () => {
            const urlId = row.dataset.urlid;
            fetch(`${serverUrl}/upvote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: urlId,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(`${urlId} upvoted`, data);
                    refreshRepo();
                })
                .catch((err) => console.log(err));
        });

        row.querySelector(".itemDownvote img").addEventListener("click", () => {
            const urlId = row.dataset.urlid;
            fetch(`${serverUrl}/downvote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: urlId,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(`${urlId} downvoted`, data);
                    refreshRepo();
                })
                .catch((err) => console.log(err));
        });
    });
};

const refreshRepo = () => {
    const repoBody = document.querySelector(".repoBody");
    repoBody.innerHTML = "Loading...";
    fetch(`${serverUrl}/all`)
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data);
            repoBody.innerHTML = data
                ?.map((url) => {
                    return `
        <div class="tripleRow itemRow" data-urlid="${url._id}">
          <div class="itemUrl" title="${url.url}">${url.url}</div>
          <div class="itemUpvote"><img src="assets/thumbsUpDark.svg" alt="Thumbs Up"/>${url.upVotes}</div>
          <div class="itemDownvote"><img src="assets/thumbsDownDark.svg" alt="Thumbs Down"/>${url.downVotes}</div>
        </div>`;
                })
                .join("");
            attachEventListeners();
        })
        .catch((err) => console.log(err));
};

document.querySelector(".listBtn").addEventListener("click", () => {
    document.querySelector(".wrapper-1").style.display = "none";
    document.querySelector(".wrapper-2").style.display = "block";
    refreshRepo();
});

document.querySelector(".backBtn").addEventListener("click", () => {
    document.querySelector(".wrapper-1").style.display = "block";
    document.querySelector(".wrapper-2").style.display = "none";
});
