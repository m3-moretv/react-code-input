import React, { useState, useRef, KeyboardEvent, FocusEvent } from 'react';
import classNames from 'classnames';
import { moveToNewTarget, uuid, defaultOnFocus, fillEmptyArray } from './utils';

const BACKSPACE_KEY = 8;
const LEFT_ARROW_KEY = 37;
const UP_ARROW_KEY = 38;
const RIGHT_ARROW_KEY = 39;
const DOWN_ARROW_KEY = 40;
const E_SYMBOL = 'e';
const DOT_SYMBOL = '.';

export enum Types {
  text = 'text',
  number = 'number'
}

export interface ICodeInputProps {
  fields: number;
  value: string;
  name: string;
  className?: string;
  inputClassName?: string;
  invalidInputClassName?: string;
  onChange?: (value: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  type?: Types;
  isValid?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

const CodeInput: React.FC<ICodeInputProps> = ({
  fields,
  value,
  name,
  onChange,
  onBlur,
  onFocus = defaultOnFocus,
  autoFocus,
  type = Types.text,
  disabled,
  isValid = true,
  className,
  inputClassName,
  invalidInputClassName
}) => {
  const [inputsValues, setInputsValues] = useState<string[]>(
    fillEmptyArray(fields).map((element, i) => value.split('')[i] || element)
  );

  const inputsRefs = inputsValues.map(() =>
    useRef<HTMLInputElement>({} as HTMLInputElement)
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const value = target.value;

    if (value === '') {
      return;
    }

    const currInputIndex = Number(target.dataset.id);
    const nextInputIndex = currInputIndex + 1;
    let nextTarget = inputsRefs[nextInputIndex];
    const copiedInputsValues = inputsValues.slice();

    /** throwing focus on next input when the new value is equal 
    to previous cause onChange doesn't fire in this case */
    if (value.length > 1) {
      value.split('').forEach((chart, i) => {
        if (currInputIndex + i < copiedInputsValues.length) {
          copiedInputsValues[currInputIndex + i] = chart;
          /**Set focus on last input with value after ctrl + v */
          nextTarget = inputsRefs[currInputIndex + i];
        }
      });
    } else {
      copiedInputsValues[currInputIndex] = value;
    }

    if (nextTarget) {
      moveToNewTarget(nextTarget);
    }

    setInputsValues(copiedInputsValues);

    if (onChange) {
      const fullValue = copiedInputsValues.join('');
      onChange(fullValue);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<any>) => {
    const target = event.currentTarget;
    const currInputIndex = Number(target.dataset.id);
    const nextInput = inputsRefs[currInputIndex + 1];
    const prevInput = inputsRefs[currInputIndex - 1];

    switch (event.keyCode) {
      case BACKSPACE_KEY:
        event.preventDefault();
        const copiedInputsValues = inputsValues.slice();
        copiedInputsValues[currInputIndex] = '';
        setInputsValues(copiedInputsValues);
        if (prevInput) {
          moveToNewTarget(prevInput);
        }
        if (onChange) {
          const fullValue = copiedInputsValues.join('');
          onChange(fullValue);
        }
        break;

      case LEFT_ARROW_KEY:
        event.preventDefault();
        if (prevInput) {
          moveToNewTarget(prevInput);
        }
        break;

      case RIGHT_ARROW_KEY:
        event.preventDefault();
        if (nextInput) {
          moveToNewTarget(nextInput);
        }
        break;

      case UP_ARROW_KEY:
        event.preventDefault();
        break;

      case DOWN_ARROW_KEY:
        event.preventDefault();
        break;

      default:
        break;
    }

    switch (event.key) {
      case E_SYMBOL:
      case DOT_SYMBOL:
        if (type === Types.number) {
          event.preventDefault();
          break;
        }

      default:
        break;
    }
  };

  const inputClasses = classNames(
    inputClassName,
    invalidInputClassName && { [invalidInputClassName]: !isValid }
  );

  return (
    <div className={className}>
      {inputsValues.map((value, i) => {
        return (
          <input
            ref={inputsRefs[i]}
            id={uuid()}
            name={name}
            data-id={i}
            autoFocus={autoFocus && i === 0}
            value={value}
            key={`input-${i}`}
            type={type}
            disabled={disabled}
            className={inputClasses}
            onBlur={onBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
          />
        );
      })}
    </div>
  );
};

export default CodeInput;
