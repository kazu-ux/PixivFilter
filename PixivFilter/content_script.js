//NG登録したユーザーのイラストを非表示
const deleteElement = (userId = String()) => {
    const elements = document.querySelectorAll(".l7cibp-2.mHtZd");
    //console.log(elements);
    Array.prototype.map.call(elements, (element) => {
        const target = element.querySelector(`[href="/users/${userId}"]`);
        //console.log(target);
        if (target) {
            //console.log(target);
            element.remove();
        }
    })
}

//ユーザー名の隣にNG登録するボタンを設置
const createAddElement = async (elements = []) => new Promise(async (resolve, reject) => {
    Array.prototype.map.call((elements), (element, index) => {
        const interval = setInterval(() => {
            if (element) {
                console.log("ループ確認用", index)
                clearInterval(interval);
                element.parentElement.insertAdjacentHTML("afterend", '<div class="addButton"> [+]</div>');
                //すべての要素に追加してからresolveする
                if (elements.length - 1 === index) { resolve(); }
            };
        }, 100);
    });
});

//追加ボタンにクリックイベントを設置
const clickEvent = async () => {
    const targets = document.querySelectorAll('.addButton');
    Array.prototype.map.call((targets), (target) => {
        console.log(target);
        target.addEventListener('click', async (e) => {
            e.stopPropagation();
            const userName = e.path[1].querySelector('[title]').getAttribute("title");
            const userId = e.path[1].querySelector('[href]').getAttribute("href").slice(7);
            console.log(userName, userId);
            addChoromeStorage({ userName: userName, userId: userId });
            deleteElement(userId);
        });
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
                    deleteElement(info.userId)
                });
            };
            resolve();
        });
    };
});

const main = async () => {
    const interval = setInterval(async () => {
        //要素が読み込まれるまで待機
        const elements = document.getElementsByClassName("sc-1rx6dmq-2 cjMwiA");
        if (elements[0]) {
            console.log(elements);
            clearInterval(interval);
            console.log("test");
            await createAddElement(elements);
            await checkGoogleStorage({ key: "userKey", isAdd: false });
            console.log("test");
            await clickEvent();
        }
    }, 100);
};

chrome.runtime.onMessage.addListener((message) => {
    main();
});