import { useEffect, useState } from 'react';
import { ChromeStorage } from '../../utils/chrome_storage';
import Modal from './myModal';
import { css } from '@emotion/react';
import { CandidateRepository } from '../repositories/candidate_repository';

const blockTagsStr = chrome.i18n.getMessage('blockTags');
const removeButtonStr = chrome.i18n.getMessage('removeButton');

export const BlockTag = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const [inputValue, setInputValue] = useState('');

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
    <div className='ng-config-container'>
      <div className='title-container'>
        <div className='ng-tag-title'>{blockTagsStr}</div>
        <div className='tags-count'>({tagCount})</div>
      </div>

      <div className='select-container'>
        <select className='tag-select' multiple name='tagNames'>
          {optionElement}
        </select>
        <div css={buttonContainer}>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form
              action=''
              method='get'
              onSubmit={(e) => {
                e.preventDefault();
                console.log(inputValue);

                ChromeStorage.addBlockTag(inputValue).then(() => {
                  closeModal();
                  // setInputValue('');
                });
              }}
            >
              <input
                type='text'
                name='keyword'
                className='input'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
              />
              <button type='submit'>Close</button>
            </form>
          </Modal>

          <button className='tag-add-button' name='add' onClick={openModal}>
            追加
          </button>

          <button className='tag-remove-button' name='remove' onClick={onClick}>
            {removeButtonStr}
          </button>
        </div>
      </div>
    </div>
  );
};

const buttonContainer = css`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 0.5rem;
`;
