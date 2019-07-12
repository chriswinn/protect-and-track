import React from 'react';
import './RadioButton.css';

function RadioButton({ children, checked, id, name, value }) {
  return (
    <div class="RadioButton" id={id}>
      <input type="radio" checked={checked} name={name} id={id + '-input'} />
      <label value={value} for={id + '-input'}>
        {children}
      </label>
    </div>
  );
}

export default RadioButton;