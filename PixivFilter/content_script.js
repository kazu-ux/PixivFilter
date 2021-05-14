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

const createAddElement = async (elements = []) => {
    return Array.prototype.map.call((elements), (element) => {
        try {
            element.querySelector('.sc-1rx6dmq-2.cjMwiA').insertAdjacentHTML("afterend", '<div class="addButton"> [+]</div>');
        } catch (error) {
            ;
        }
        return
    });
}

const addToStorage = () => {
    const targets = document.querySelectorAll('.addButton');
    //let userIds = [];
    Array.prototype.map.call((targets), (target) => {
        target.addEventListener('click', async (e) => {
            const userId = e.path[1].querySelector('[href]').getAttribute("href").slice(7);
            console.log(userId);
            //if (checkLocalStorage('userId')[0] === undefined) { }
            //userIds = ;
            let userIds = await checkLocalStorage('userId');
            console.log(userIds);
            userIds.push(userId)
            //console.log(userId);
            chrome.storage.sync.set({ userId: userIds }, () => { return })
            deleteElement(userId);
            //console.log(e);

        });
    })
}

const checkLocalStorage = (query = String()) => new Promise((resolve) => {
    chrome.storage.sync.get([query], (dic) => {
        const results = dic.userId;
        console.log(results);
        if (results) {
            results.map((result = []) => {
                console.log(result);
                deleteElement(result);
            })
            resolve(results);
        } else { resolve }
    });
});

const main = () => {
    const interval = setInterval(async () => {
        const elements = document.querySelectorAll(".l7cibp-2.mHtZd");
        console.log(elements)
        if (elements.length) {
            clearInterval(interval);
            await createAddElement(elements);
            await checkLocalStorage("userId")
            //deleteElement("89795682");
            //deleteElement("68475181");
            //chrome.storage.sync.clear()

            addToStorage();
        }
    }, 1000);
}

document.addEventListener('load', main());