//HTMLを生成
const createHtml = () => new Promise(async (resolve) => {
    const users = await checkGoogleStorage({ key: "userKey", isAdd: true });
    if (users) {
        users.map((userDic) => {
            const userName = userDic.userName;
            const userId = userDic.userId;
            const optionElement = document.createElement('option');
            optionElement.textContent = userName;
            optionElement.value = userId;
            document.querySelector('.user-select').appendChild(optionElement);
        });
    };

    const fragment = document.createDocumentFragment();

    const tagList = await new Promise((resolve) => {
        chrome.storage.sync.get(['tagName'], (results) => {
            if (results.tagName) { resolve(results.tagName); } else { resolve([]); };
        });
    });
    console.log(tagList);

    await Promise.all(tagList.map((tag) => {
        const optionElement = document.createElement('option');
        optionElement.textContent = tag;
        optionElement.value = tag;
        fragment.appendChild(optionElement);
        return fragment;
    }));
    console.log(fragment);
    document.querySelector('.tag-select').appendChild(fragment);

    const interval = setInterval(() => {
        const target = document.getElementsByTagName('body')[0];
        if (target) {
            clearInterval(interval);
            resolve();
        };
    }, 100);
});

//Chromeストレージからユーザー情報を取得
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
                    console.log(info);
                    deleteElement(info.userId)
                });
            };
            resolve();
        });
    };
});

//クリックイベント
const clickEvent = async () => {
    const removeButton = document.querySelectorAll("[name='remove']");
    await Promise.all(Array.prototype.map.call((removeButton), (element) => {
        element.addEventListener('click', async (e) => {
            const className = e.target.getAttribute('class');
            if (className === 'user-remove-button') {
                const options = document.querySelector('.user-select').options;
                const selectedUsers = (Array.prototype.map.call((options), (option) => {
                    if (!option.selected) {
                        const userName = option.textContent;
                        const userId = option.getAttribute('value')
                        console.log(option.getAttribute('value'));
                        return { userName: userName, userId: userId };
                    };
                })).filter((n) => { return n != undefined });

                const usersObj = { userDatas: selectedUsers };
                console.log(usersObj);
                removeChromeStorage(usersObj);

            } else if (className === 'tag-remove-button') {
                const options = document.querySelector('.tag-select').options;
                const selectedTags = (Array.prototype.map.call((options), (option) => {
                    if (!option.selected) {
                        return option.getAttribute('value');
                    };
                })).filter((n) => { return n != undefined });
                const tagsObj = { tagNames: selectedTags };
                console.log(tagsObj);
                removeChromeStorage(tagsObj);
            };
            //console.log(className);
        })
        return;
    }))
    //console.log(removeButton);
};

//Chromeストレージから削除
const removeChromeStorage = async (userOrTagObj = {}) => {
    console.log(userOrTagObj);
    if (userOrTagObj.userDatas) {
        chrome.storage.sync.set({ userKey: userOrTagObj.userDatas });
    } else if (userOrTagObj.tagNames) {
        chrome.storage.sync.set({ tagName: userOrTagObj.tagNames });
    }
    location.reload();
};

const main = async () => {
    await createHtml();
    await clickEvent()

};

document.addEventListener('load', main());