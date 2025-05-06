import { useState } from 'react';
import Modal from './myModal';
import styles from './Block_tag.module.css';
import { useChromeStorage } from '../hooks/use_chrome_storage';

const blockTagsStr = chrome.i18n.getMessage('blockTags');
const removeButtonStr = chrome.i18n.getMessage('removeButton');
const addButtonStr = chrome.i18n.getMessage('addButton');
const addDescriptionStr = chrome.i18n.getMessage('addDescription');
const uniqueErrorStr = chrome.i18n.getMessage('uniqueError');

export const BlockTag = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const [inputValue, setInputValue] = useState('');
  const { value: blockTags, setValue: setBlockTags } = useChromeStorage<
    string[]
  >('blockTags', []);

  const [isHidden, setIsHidden] = useState(true);

  const onClick = async () => {
    const select = document.querySelector(
      'select.tag-select'
    ) as HTMLSelectElement;
    const tagOptions = select.options;
    const allTags = Array.from(tagOptions).map((option) => option.value);
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
      .filter((item): item is NonNullable<typeof item> => item !== null); // undefined を除く

    if (!selectedTags.includes) return;

    // 2つの配列の差分を抽出
    const diffTags = allTags.filter((tag) => !selectedTags.includes(tag));
    setBlockTags(diffTags);
    select.selectedIndex = -1;
  };

  return (
    <div className='ng-config-container'>
      <div className='title-container'>
        <div className='ng-tag-title'>{blockTagsStr}</div>
        <div className='tags-count'>({blockTags.length})</div>
      </div>

      <div className='select-container'>
        <select className='tag-select' multiple name='tagNames'>
          {blockTags.map((tag, index) => {
            return (
              <option value={tag} key={index}>
                {tag}
              </option>
            );
          })}
        </select>
        <div className={styles.buttonContainer}>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form
              action=''
              method='get'
              onSubmit={(e) => {
                e.preventDefault();
                console.log(inputValue);

                // すでに登録されている場合は追加しない
                if (blockTags.includes(inputValue)) return;

                setBlockTags([...blockTags, inputValue]);
                setInputValue('');
                closeModal();
              }}
            >
              <div>{addDescriptionStr}</div>
              <input
                type='text'
                name='keyword'
                className='input'
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setIsHidden(!blockTags.includes(value));
                  setInputValue(value);
                }}
                autoFocus
              />
              <button type='submit'>追加</button>
              <div hidden={isHidden}>{uniqueErrorStr}</div>
            </form>
          </Modal>

          <button className='tag-add-button' name='add' onClick={openModal}>
            {addButtonStr}
          </button>

          <button className='tag-remove-button' name='remove' onClick={onClick}>
            {removeButtonStr}
          </button>
        </div>
      </div>
    </div>
  );
};
