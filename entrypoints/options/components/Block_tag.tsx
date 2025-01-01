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

  const sampleList = [
    'sample1',
    'sample2',
    'sample3',
    'ドラえもん',
    '野比のび太',
    'サンプル3',
  ];

  const [inputValue, setInputValue] = useState('');

  const filteredSampleList = sampleList.filter((item) =>
    inputValue ? item.includes(inputValue) : item
  );

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
            {/* サジェスト付きの検索ボックス */}
            <input
              type='text'
              list={inputValue ? 'keyword' : ''}
              name='keyword'
              className='input'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div css={suggestionContainer}>
              {filteredSampleList.map((item) => (
                <button key={item}>{item}</button>
              ))}
            </div>

            <button onClick={closeModal}>Close</button>
          </Modal>
          <button className='tag-add-button' name='add' onClick={openModal}>
            追加
          </button>
          <button
            onClick={async () => {
              const response = await CandidateRepository.fetchCandidates();
              console.log(response);
            }}
          >
            apiテスト
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

const suggestionContainer = css`
  // ボックスのスタイルを変更する
  border: 1px solid #ccc;
  // 影をつける
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  // 丸くする
  border-radius: 5px;
  // 縦並び
  display: flex;
  flex-direction: column;
  // 余白
  padding: 0.5rem;
  // 最前面に表示
  z-index: 1;
  // 他の要素と重ねる
  position: relative;

  button {
    // ボタンのスタイルを変更する
    width: 100%; // ボタンの幅を100%にする
    padding: 0.5rem; // ボタンの内側の余白を追加する
    margin-bottom: 0.5rem; // ボタン間の余白を追加する
    background-color: #fff; // ボタンの背景色を白にする
    border: 1px solid #ccc; // ボタンの境界線を追加する
    border-radius: 5px; // ボタンの角を丸くする
    cursor: pointer; // ボタンにカーソルを追加する
  }
`;
