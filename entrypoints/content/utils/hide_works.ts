export class HideWorks {
  private static getCardContainer(element: HTMLElement): HTMLElement | null {
    return element.closest('li') ?? element.closest('[class*="col-span"]');
  }

  static async user(userId: string) {
    const cards = document.querySelectorAll<HTMLElement>(
      `[data-pf-user-id="${userId}"]`
    );
    cards.forEach((card) => {
      card.style.display = 'none';
    });
  }

  static async tag(tagName: string) {
    const works: NodeListOf<HTMLElement> = document.querySelectorAll(
      `[data-tag-name="${tagName}"]`
    );

    await Promise.all(
      Array.from(works).map((element) => {
        const card = HideWorks.getCardContainer(element);
        if (!card) return;
        card.style.display = 'none';
      })
    );
  }
}
