import React, { JSX, useEffect, useState } from 'react';
import { ChromeStorage } from '../../utils/chrome_storage';
import { useChromeStorage } from '../hooks/use_chrome_storage';

const blockUsersStr = chrome.i18n.getMessage('blockUsers');
const removeButtonStr = chrome.i18n.getMessage('removeButton');

export const BlockUser = () => {
  console.log('blockUser');
  const { value: blockUsers, setValue: setBlockUsers } = useChromeStorage<
    UserData[]
  >('blockUsers', []);

  const onClick = async () => {
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
        <button className='user-remove-button' name='remove' onClick={onClick}>
          {removeButtonStr}
        </button>
      </div>
    </div>
  );
};
