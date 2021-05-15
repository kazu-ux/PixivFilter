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
        }, 500);
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
        });
    });
};

//NG登録ボタンを押したらChromeストレージに保存する
const addChoromeStorage = async (userInfo = {}) => {
    let users = [];
    users = await checkLocalStorage("userInfo");
    if (!users) {
        chrome.storage.sync.set({ userInfo: [userInfo] }, () => { return });
    } else {
        users.push(userInfo);
        console.log(users)
        chrome.storage.sync.set({ userInfo: users }, () => { return });
    };
};

//ChromeストレージにNGユーザーが登録されているかを確認
const checkLocalStorage = (query = String()) => new Promise((resolve) => {
    chrome.storage.sync.get([query], (results = {}) => {
        const user = results.userInfo;
        if (user) {
            user.map((item) => { console.log(item.userId); });
        }

        //console.log(user);
        resolve(user)
    });
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
            console.log("test");
            await clickEvent();
            //await checkLocalStorage("userId")
            //deleteElement("89795682");
            //deleteElement("68475181");
            chrome.storage.sync.clear()
        }
    }, 1000);
};

document.addEventListener('load', main());