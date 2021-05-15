//HTMLを生成
const createHtml = () => new Promise(async (resolve) => {
    const divElement = document.createElement('div');
    divElement.textContent = 'ブロックするユーザー';

    const selectElement = document.createElement('select');
    selectElement.setAttribute('multiple', '');
    selectElement.name = "userName";
    selectElement.size = 10;

    const users = await checkGoogleStorage({ key: "userKey", isAdd: true });

    users.map((userDic) => {
        const userName = userDic.userName;
        const optionElement = document.createElement('option');
        optionElement.textContent = userName;
        selectElement.appendChild(optionElement);
    });

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
const clickEvent = () => {
    const targetButton = document.getElementsByName("remove")[0];
    targetButton.addEventListener('click', () => {

    });
}

const main = async () => {
    await createHtml();

};

document.addEventListener('load', main());