//HTMLを生成
const createHtml = () => new Promise(async (resolve) => {
    const divElement = document.createElement('div');
    divElement.textContent = 'ブロックするユーザー';

    const selectElement = document.createElement('select');
    selectElement.setAttribute('multiple', '');
    selectElement.name = "userNames";
    selectElement.size = 10;

    selectElement.style.width = "20vw"

    const users = await checkGoogleStorage({ key: "userKey", isAdd: true });
    if (users) {
        users.map((userDic) => {
            const userName = userDic.userName;
            const userId = userDic.userId;
            const optionElement = document.createElement('option');
            optionElement.textContent = userName;
            optionElement.value = userId;
            selectElement.appendChild(optionElement);
        });
    }

    const buttonElement = document.createElement('button');
    buttonElement.textContent = "消去";
    buttonElement.name = 'remove';

    const interval = setInterval(() => {
        const target = document.getElementsByTagName('body')[0];
        if (target) {
            clearInterval(interval);
            target.appendChild(divElement);
            target.appendChild(selectElement);
            target.appendChild(buttonElement);
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
    const targetButton = document.getElementsByName("remove")[0];
    targetButton.addEventListener('click', () => {
        let userList = []
        const options = document.getElementsByName("userNames")[0].options;
        Array.prototype.map.call((options), (option) => {
            if (option.selected) {
                userList.push(option.value)
            };
        });
        removeChromeStorage(userList);
        return;
    });
};

const removeChromeStorage = async (userList = []) => {
    const users = await checkGoogleStorage({ key: "userKey", isAdd: true });
    let newUserList = [];
    users.map((user) => {
        if (!userList.includes(user.userId)) {
            console.log(user);
            newUserList.push(user)
        };
    });
    console.log(newUserList);
    chrome.storage.sync.set({ userKey: newUserList }, () => { return });
    location.reload();
};

const main = async () => {
    await createHtml();
    await clickEvent()

};

document.addEventListener('load', main());