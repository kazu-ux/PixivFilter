import React, { useEffect, useState } from 'react';
import { ChromeStorage } from '../../database/chrome_storage';

const blockTagsStr = chrome.i18n.getMessage('blockTags');
const removeButtonStr = chrome.i18n.getMessage('removeButton');

export const BlockTag = () => {
  console.log('blockTag');
  const [tagCount, setTagCount] = useState(0);
  const [optionElement, setOptionElement] = useState<JSX.Element>();

  const toOptionElements = (tags: string[]) => {
    const optionElements = tags.flatMap((tag, index) => {
      const optionElement = (
        <option value={tag} key={index}>
          {tag}
        </option>
      );
      return optionElement;
    });
    return <>{optionElements}</>;
  };

  useEffect(() => {
    ChromeStorage.getTags().then((res) => {
      setTagCount(res.length);
      setOptionElement(toOptionElements(res));
    });
  }, []);

  return (
    <div className="ng-tag-container">
      <div className="ng-tag-title">
        {blockTagsStr}
        <div className="tags-count">({tagCount})</div>
      </div>
      <select className="tag-select" multiple name="tagNames">
        {optionElement}
      </select>
      <button
        className="tag-remove-button"
        name="remove"
        onClick={async () => {
          const tagOptions = (
            document.querySelector('select.tag-select') as HTMLSelectElement
          ).options;
          const selectedTags = Array.from(tagOptions)
            .map((option) => {
              if (option.selected) {
                const tagName = option.textContent;

                if (!tagName) return;

                console.log(tagName);

                return tagName;
              }
            })
            .filter(Boolean)
            .filter((item): item is NonNullable<typeof item> => item !== null);
          console.log(selectedTags);

          const savedTags = await ChromeStorage.removeTags(selectedTags);
          setTagCount(savedTags.length);
          setOptionElement(toOptionElements(savedTags));
        }}
      >
        {removeButtonStr}
      </button>
    </div>
  );
};