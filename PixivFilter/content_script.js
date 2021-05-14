const deleteElement = (id = String()) => {
    const elements = document.querySelectorAll(".l7cibp-2.mHtZd");
    console.log(elements);
    Array.prototype.map.call(elements, (element) => {
        const target = element.querySelector(`[href="/artworks/${id}"]`);
        console.log(target);
        if (target) {
            console.log(target);
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
    let userIds = [];
    Array.prototype.map.call((targets), (target) => {
        target.addEventListener('click', (e) => {
            const userId = e.path[1].querySelector('[href]').getAttribute("href").slice(7);
            //if (checkLocalStorage('userId')[0] === undefined) { }
            //userIds = ;
            checkLocalStorage('userId')
            userIds.push(userId)
            //console.log(userId);
            chrome.storage.sync.set({ userId: userIds }, () => { return })
            //console.log(e);

        });
    })
}

const checkLocalStorage = (query = String()) => {
    chrome.storage.sync.get([query], (dic) => {
        const results = dic.userId;
        console.log(results);
        if (results.length) {
            results.map((result) => {
                console.log(result);
                deleteElement(result);
            })
        }
    });
}


(async () => {
    const interval = setInterval(async () => {
        const elements = document.querySelectorAll(".l7cibp-2.mHtZd");
        if (elements.length) {
            clearInterval(interval);
            checkLocalStorage("userId")
            //deleteElement("89795682");
            //deleteElement("89732041");
            await createAddElement(elements);
            //addToStorage();
        }
    }, 1000);
})();