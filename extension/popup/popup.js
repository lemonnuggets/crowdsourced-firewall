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
        })
        .catch((err) => console.log(err));
});

const refreshRepo = () => {
    const repoBody = document.querySelector(".repoBody");
    repoBody.innerHTML = "";
    fetch(`${serverUrl}/all`)
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data);
            repoBody.innerHTML = data
                ?.map((url) => {
                    return `
        <div class="tripleRow itemRow">
          <div class="itemUrl" title="${url.url}">${url.url}</div>
          <div class="itemUpvotes"><img src="assets/thumbsUpDark.svg" alt="Thumbs Up"/>${url.upVotes}</div>
          <div class="itemDownvotes"><img src="assets/thumbsDownDark.svg" alt="Thumbs Down"/>${url.downVotes}</div>
        </div>`;
                })
                .join("");
        });
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
