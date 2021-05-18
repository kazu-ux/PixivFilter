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

//ユーザー名の隣にNG登録するボタンとタグ表示ボタンを設置
const createAddButton = async (elements = []) => new Promise(async (resolve, reject) => {

    await Promise.all(Array.prototype.map.call((elements), async (element, index) => {
        if (element) {
            if (!element.parentElement.nextElementSibling) {
                const divElement = document.createElement('div');
                divElement.className = 'pf-add-button-and-toggle';

                console.log(element, index)

                //ユーザー登録ボタンを設置
                const spanElementAddButton = document.createElement('span');
                spanElementAddButton.className = 'pf-add-button';
                spanElementAddButton.textContent = '[+]';

                //矢印を設置
                const toggleElement = document.createElement('span');
                toggleElement.className = 'pf-illust-info-toggle';
                toggleElement.textContent = '▼';

                divElement.appendChild(spanElementAddButton);
                divElement.appendChild(toggleElement);

                element.parentElement.parentElement.appendChild(divElement);
                //element.parentElement.insertAdjacentHTML("afterend", '<div class="addButton"> [+]</div>');
                return;
            };
        };
    }));
    resolve();
});

//タグを表示する
const createTagElement = async (illustDatas = []) => new Promise(async (resolve) => {
    console.log(illustDatas);

    const targets = document.getElementsByClassName('pf-add-button');

    await Promise.all(Array.prototype.map.call((targets), async (target, index) => {

        //タグコンテナを追加
        const tags = illustDatas[index].tags;
        target.parentElement.parentElement.parentElement.appendChild(await createTagContainer(tags));
        return;
    }));

    resolve();
})

const createTagContainer = (illustTags = []) => new Promise(async (resolve) => {
    const pElement = document.createElement('p');
    pElement.className = 'pf-tag-container';
    const illustTagcontainers = await Promise.all(illustTags.map((illust_tag) => {
        const divElement = document.createElement('div');
        divElement.className = 'pf-illust-info-container';

        const spanElementIllustTag = document.createElement('p');
        spanElementIllustTag.className = 'pf-illust-tag';

        const aElement = document.createElement('a');
        aElement.className = 'pf-illust-tag-link';
        aElement.target = '-blank';
        aElement.href = `https://www.pixiv.net/tags/${illust_tag}`;
        aElement.textContent = illust_tag;

        const spanElementTagNgButton = document.createElement('span');
        spanElementTagNgButton.className = "pf-tag-ng-button";
        spanElementTagNgButton.setAttribute('data-type', 'add');
        spanElementTagNgButton.setAttribute('data-tag-name', illust_tag);
        spanElementTagNgButton.textContent = "[+]"

        spanElementIllustTag.appendChild(aElement);
        spanElementIllustTag.appendChild(spanElementTagNgButton);

        pElement.appendChild(spanElementIllustTag);

        divElement.appendChild(pElement);

        return divElement;
    }));

    console.log(illustTagcontainers);
    resolve(illustTagcontainers[illustTagcontainers.length - 1]);
})

//外部cssを読み込む
const loadCss = () => new Promise((resolve) => {
    const linkElement = document.createElement('link');
    linkElement.href = './style.css';
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';

    document.getElementsByTagName('head')[0].appendChild(linkElement);
})

//クリックイベント処理
const clickEvent = async () => {
    document.addEventListener('click', async (e) => {
        e.stopPropagation();
        console.log(e.target);
        const target = e.target.parentElement.parentElement.parentElement.getElementsByClassName("pf-tag-container")[0];
        if (e.target.getAttribute('class') === 'pf-add-button') {
            console.log(e.path);
            const userName = e.path[2].querySelector('[title]').getAttribute("title");
            const userId = e.path[2].querySelector('[href]').getAttribute("href").slice(7);
            console.log(userName, userId);
            addChoromeStorage({ userName: userName, userId: userId });
            removeElement(userId);
        } else if (e.target.getAttribute('class') === 'pf-illust-info-toggle') {
            console.log(target)

            if (target.parentElement.classList.toggle('pf-illust-info-container')) {
                e.target.textContent = '▼';
            } else {
                e.target.textContent = '▲';
            }

            console.log(target.parentElement);
            //console.log(.getElementsByClassName("iasfms-0 iubowd pf-illust-info-container")[0].style.display = "flex");
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
            await createAddButton(elements)
            console.log(e);
        }, 500);
    };
    document.addEventListener("scroll", func, { passive: true });
};

const main = async (illustDatas) => {
    const interval = setInterval(async () => {
        //要素が読み込まれるまで待機
        const elements = document.getElementsByClassName("sc-1rx6dmq-2 cjMwiA");
        if (elements[0]) {
            clearInterval(interval);
            console.log("test");
            scrollEvent(elements);
            await createAddButton(elements);
            console.log("test");
            await createTagElement(illustDatas);
            console.log("test");
            //await loadCss();
            console.log("test");
            await checkGoogleStorage({ key: "userKey", isAdd: false });
            console.log("test");
            await clickEvent();
        };
    }, 100);
};

chrome.runtime.onMessage.addListener((illustDatas = []) => {
    main(illustDatas);
});