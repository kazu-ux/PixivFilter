import React, { useState, useRef, useEffect } from 'react';
import { useChromeStorage } from '../hooks/use_chrome_storage';
import Modal from './myModal';
import {
  addButtonStr,
  addUserDescriptionStr,
  blockUsersStr,
  removeButtonStr,
  uniqueErrorStr,
} from '../locales/locales';

export const BlockUser = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
    setIsErrorShow(false);
  }, [isModalOpen]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const [isErrorShow, setIsErrorShow] = useState(false);

  console.log('blockUser');
  const { value: blockUsers, setValue: setBlockUsers } = useChromeStorage<
    BlockUser[]
  >('blockUsers', []);

  const onRemoveClick = async () => {
    const userOptions =
      document.querySelector<HTMLSelectElement>('select.user-select')?.options;
    if (!userOptions) return;

    const selectedUsers = Array.from(userOptions)
      .map((option) => {
        if (option.selected) {
          const userName = option.textContent;
          const userId = option.getAttribute('value');
          if (!(userName && userId)) return;

          return { userName: userName, userId: userId };
        }
      })
      .filter(Boolean)
      .filter((item): item is NonNullable<typeof item> => item !== null);
    console.log(selectedUsers);

    if (!selectedUsers.includes) return;

    const diffUsers = blockUsers.filter(
      (user) => !selectedUsers.map((user) => user.userId).includes(user.userId)
    );

    setBlockUsers(diffUsers);

    userOptions.selectedIndex = -1;
  };

  const onSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const q = formData.get('q');
    // 数字のみ
    const userId = q?.toString().replace(/[^0-9]/g, '');
    if (!userId) {
      setIsLoading(false);
      alert('不正な値です。\nInvalid value.');
      return;
    }

    // Pixivサーバーに負荷をかけないため3秒待機
    await new Promise((resolve) => setTimeout(resolve, 3000));

    interface PixivUserJson {
      props: {
        pageProps: {
          meta: {
            ogp: {
              title: string;
              image: string;
              description: string;
              type: string;
            };
          };
        };
      };
    }

    const url = `https://www.pixiv.net/users/${userId}`;
    const request = await fetch(url, {
      method: 'GET',
      referrer: 'https://www.pixiv.net/',
    });

    if (!request.ok) {
      setIsLoading(false);
      alert(
        'ユーザー名が取得できませんでした。\nThe username could not be retrieved.'
      );
      return;
    }
    const response = await request.text();
    const parser = new DOMParser();
    const document = parser.parseFromString(response, 'text/html');
    const html = document.querySelector('#__NEXT_DATA__');
    const json = JSON.parse(html?.textContent || '') as PixivUserJson;

    setBlockUsers([
      ...blockUsers,
      { userName: json.props.pageProps.meta.ogp.title, userId },
    ]);

    setIsLoading(false);
    closeModal();
  };

  return (
    <div className='ng-config-container'>
      <div className='title-container'>
        <div className='ng-user-title'>{blockUsersStr}</div>
        <div className='users-count'>({blockUsers.length})</div>
      </div>

      <div className='select-container'>
        <select className='user-select' multiple name='userNames'>
          {blockUsers.map((user, index) => {
            return (
              <option value={user.userId} key={index}>
                {user.userName}
              </option>
            );
          })}
        </select>
        <div className='button-container'>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form
              action=''
              method='get'
              target='_blank'
              onSubmit={(e) => {
                onSubmit(e);
              }}
            >
              <div>{addUserDescriptionStr}</div>
              <input
                type='text'
                name='q'
                autoComplete='off'
                ref={inputRef}
                onChange={(e) => {
                  const userId = e.target.value.replace(/[^0-9]/g, '');
                  if (blockUsers.find((user) => user.userId === userId))
                    setIsErrorShow(true);
                  else setIsErrorShow(false);
                }}
              />
              <button type='submit' disabled={isLoading || isErrorShow}>
                {isLoading ? <span className='loader'></span> : addButtonStr}
              </button>
              {isErrorShow && (
                <div className='user-hidden'>{uniqueErrorStr}</div>
              )}
            </form>
          </Modal>
          <button
            onClick={async () => {
              openModal();
            }}
          >
            {addButtonStr}
          </button>
          <button
            className='user-remove-button'
            name='remove'
            onClick={onRemoveClick}
          >
            {removeButtonStr}
          </button>
        </div>
      </div>
    </div>
  );
};
