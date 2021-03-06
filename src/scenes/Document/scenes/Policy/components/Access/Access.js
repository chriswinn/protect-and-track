// MIT License
//
// Copyright (c) 2019 Virtru Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import React, { useState } from 'react';

import SectionHeader from '../SectionHeader/SectionHeader';
import { ReactComponent as AccessIcon } from './access.svg';
import { NOPE } from '../../services/policyChanger';
import './Access.css';
import Button from 'components/Button/Button';
import { ReactComponent as InfoIcon } from './info-icon.svg';

function Access({ encryptState, userId, policy, policyChange, isPolicyRevoked }) {
  const Grant = ({ user, status }) => {
    if (status === 'owner') {
      return (
        <div className="Grant">
          <div className="Grant-user">{user}</div>
          <div className="Grant-owner">Owner</div>
        </div>
      );
    }

    return (
      <form className="Grant" onSubmit={policyChange(p => p.removeUsersWithAccess(user))}>
        <div className="Grant-user">{user}</div>
        <input type="submit" className="Grant-revoke" value="Revoke" disabled={isPolicyRevoked} />
      </form>
    );
  };

  const NewGrant = () => {
    const [input, setInput] = useState({ text: '', valid: false });
    let hasUsers = policy.getUsersWithAccess().length > 0;

    let action;
    if (hasUsers) {
      action = (
        <input type="submit" className="Grant-grant" disabled={!input.valid} value="Grant" />
      );
    } else {
      action = (
        <Button disabled={!input.valid} type="submit" small>
          Grant
        </Button>
      );
    }

    return (
      <form
        className="NewGrant"
        onSubmit={policyChange(p => (input.valid ? p.addUsersWithAccess(input.text) : NOPE))}
      >
        <div className="field-with-description">
          <input
            type="email"
            name="newUser"
            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}$"
            onChange={e =>
              setInput({
                text: e.target.value,
                valid: e.target && !!e.target.value && e.target.validity.valid,
              })
            }
            value={input.text}
          />
          <div className="field-description">
            <InfoIcon className="icon info-icon" /> Enter an email address
          </div>
          <div className="field-error">
            <InfoIcon className="icon info-icon" /> Invalid email address
          </div>
        </div>
        {action}
      </form>
    );
  };

  return (
    <div className="Access">
      <SectionHeader>
        <AccessIcon />
        <h4>Who should have access?</h4>
      </SectionHeader>
      <ol start="0">
        <li key={'you'}>
          <Grant user={userId || 'you'} status="owner" />
        </li>
        {!isPolicyRevoked &&
          policy
            .getUsersWithAccess()
            .filter(u => u !== userId)
            .map((user, i) => {
              return (
                <li key={user}>
                  <Grant user={user} status="reader" />
                </li>
              );
            })}
      </ol>
      {!isPolicyRevoked && <NewGrant />}
    </div>
  );
}

export default Access;
