import React, { useEffect, useState } from 'react';
import { ChromeStorage } from '../../database/chrome_storage';

const blockUsersStr = chrome.i18n.getMessage('blockUsers');
const removeButtonStr = chrome.i18n.getMessage('removeButton');

export const BlockUser = () => {
  const [userCount, setUserCount] = useState(0);
  const [optionElement, setOptionElement] = useState<JSX.Element>();

  console.log('blockUser');

  const toOptionElements = (usersData: UserData[]) => {
    const optionElements = usersData.flatMap((userData, index) => {
      const optionElement = (
        <option value={userData.userId} key={index}>
          {userData.userName}
        </option>
      );
      return optionElement;
    });
    return <>{optionElements}</>;
  };

  useEffect(() => {
    console.log('useEffect');

    ChromeStorage.getUser().then((res) => {
      setUserCount(res.length);
      setOptionElement(toOptionElements(res));
    });
  }, []);

  return (
    <div className="ng-user-container">
      <div className="ng-user-title">
        {blockUsersStr} <div className="users-count">({userCount})</div>
      </div>
      <select className="user-select" multiple name="userNames">
        {optionElement}
      </select>
      <button
        className="user-remove-button"
        name="remove"
        onClick={async () => {
          const userOptions = (
            document.querySelector('select.user-select') as HTMLSelectElement
          ).options;
          const selectedUsers = Array.from(userOptions)
            .map((option) => {
              if (option.selected) {
                const userName = option.textContent;
                const userId = option.getAttribute('value');
                if (!(userName && userId)) {
                  return;
                }
                console.log(userName, userId);

                return { userName: userName, userId: userId };
              }
            })
            .filter(Boolean)
            .filter((item): item is NonNullable<typeof item> => item !== null);
          console.log(selectedUsers);

          const savedUsers = await ChromeStorage.removeUser(selectedUsers);
          setUserCount(savedUsers.length);
          setOptionElement(toOptionElements(savedUsers));
        }}
      >
        {removeButtonStr}
      </button>
    </div>
  );
};
