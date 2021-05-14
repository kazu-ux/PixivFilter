const deleteElement = (id = String(), elements = []) => {
    //const elements = document.querySelectorAll(".l7cibp-2.mHtZd");
    console.log(elements);
    Array.prototype.map.call(elements, (element) => {
        const target = element.querySelector(`[href="/artworks/${id}"]`);
        if (target) {
            element.remove();
        }
    })
}

(async () => {
    const interval = setInterval(() => {
        const elements = document.querySelectorAll(".l7cibp-2.mHtZd");
        if (elements.length) {
            clearInterval(interval);
            deleteElement("89795682", elements);
        }
    }, 1000);
})();

//document.addEventListener('load', deleteElement("89795682"));