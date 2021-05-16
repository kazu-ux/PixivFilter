//NG登録したユーザーのイラストを非表示
const removeElement = (userId = String()) => {
    console.log(userId);
    const targets = document.querySelectorAll(`[href="/users/${userId}"]`);
    if (targets) {
        Array.prototype.map.call((targets), (target) => {
            target.closest('.iasfms-0.iubowd').parentElement.parentElement.remove();
            console.log(target);
        });
    };
};

//ユーザー名の隣にNG登録するボタンを設置
const createAddElement = async (elements = []) => new Promise(async (resolve, reject) => {
    await Promise.all(Array.prototype.map.call((elements), async (element, index) => {
        if (element) {
            if (!element.parentElement.nextElementSibling) {
                console.log(element, index)
                element.parentElement.insertAdjacentHTML("afterend", '<div class="addButton"> [+]</div>');
                return;
            };
        };
    }));
    resolve();
});

//クリックイベント処理
const clickEvent = async () => {
    document.addEventListener('click', async (e) => {
        e.stopPropagation();
        console.log(e.target);
        if (e.target.getAttribute('class') === 'addButton') {
            const userName = e.path[1].querySelector('[title]').getAttribute("title");
            const userId = e.path[1].querySelector('[href]').getAttribute("href").slice(7);
            console.log(userName, userId);
            addChoromeStorage({ userName: userName, userId: userId });
            removeElement(userId);
        };
    });
};

//NG登録ボタンを押したらChromeストレージに保存する
const addChoromeStorage = async (userDic = {}) => {
    let users = [];
    users = await checkGoogleStorage({ key: "userKey", isAdd: true });
    if (!users) {
        chrome.storage.sync.set({ userKey: [userDic] }, () => { return });
    } else {
        users.push(userDic);
        console.log(users)
        chrome.storage.sync.set({ userKey: users }, () => { return });
    };
};

//ChromeストレージにNGユーザーが登録されているかを確認
const checkGoogleStorage = (parameter = { key: String(), isAdd: Boolean }) => new Promise((resolve) => {
    if (parameter.isAdd) {
        chrome.storage.sync.get([parameter.key], (results = {}) => {
            if (results === {}) {
                resolve([]);
            } else {
                const user = results.userKey;
                console.log(user)
                resolve(user)
            };
        });
    } else if (!parameter.isAdd) {
        chrome.storage.sync.get([parameter.key], (results = {}) => {
            const user = results.userKey;
            if (user) {
                user.map((info) => {
                    removeElement(info.userId)
                });
            };
            resolve();
        });
    };
});

const scrollEvent = async (elements) => {
    let timer = null;
    const func = (e) => {
        clearTimeout(timer);
        timer = setTimeout(async () => {
            await createAddElement(elements)
            console.log(e);
        }, 500);
    };
    document.addEventListener("scroll", func, { passive: true });
};

const main = async () => {
    const interval = setInterval(async () => {
        //要素が読み込まれるまで待機
        const elements = document.getElementsByClassName("sc-1rx6dmq-2 cjMwiA");
        if (elements[0]) {
            clearInterval(interval);
            console.log("test");
            scrollEvent(elements);
            await createAddElement(elements);
            console.log("test");
            await checkGoogleStorage({ key: "userKey", isAdd: false });
            console.log("test");
            await clickEvent();
        };
    }, 100);
};

chrome.runtime.onMessage.addListener(() => {
    main();
});