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
    ChromeStorage.getBlockTags().then((res) => {
      setTagCount(res.length);
      setOptionElement(toOptionElements(res));
    });
  }, []);

  const onClick = async () => {
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
    if (!selectedTags.includes) return;

    const savedTags = await ChromeStorage.removeBlockTags(selectedTags);
    setTagCount(savedTags.length);
    setOptionElement(toOptionElements(savedTags));
  };

  return (
    <div className="ng-tag-container">
      <div className="ng-tag-title">
        {blockTagsStr}
        <div className="tags-count">({tagCount})</div>
      </div>
      <select className="tag-select" multiple name="tagNames">
        {optionElement}
      </select>
      <button className="tag-remove-button" name="remove" onClick={onClick}>
        {removeButtonStr}
      </button>
    </div>
  );
};
