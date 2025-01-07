export class HideWorks {
  static async user(userId: string) {
    const works: NodeListOf<HTMLElement> = document.querySelectorAll(
      `[data-gtm-value="${userId}"]`
    );

    await Promise.all(
      Array.from(works).map((element) => {
        const liElement = element.closest('li');
        if (!liElement) return;
        liElement.style.display = 'none';
      })
    );
  }

  static async tag(tagName: string) {
    const works: NodeListOf<HTMLElement> = document.querySelectorAll(
      `[data-tag-name="${tagName}"]`
    );

    await Promise.all(
      Array.from(works).map((element) => {
        const liElement = element.closest('li');
        if (!liElement) return;
        liElement.style.display = 'none';
      })
    );
  }
}
