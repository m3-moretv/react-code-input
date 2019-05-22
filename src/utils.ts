import { RefObject, FocusEvent } from 'react';

export const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c, r) =>
    // tslint:disable-next-line
    ('x' === c ? (r = (Math.random() * 16) | 0) : (r & 0x3) | 0x8).toString(16)
  );

export const moveToNewTarget: (
  newTarget: RefObject<HTMLInputElement>
) => void = newTarget => {
  if (newTarget.current) {
    newTarget.current.focus();
    newTarget.current.select();
  }
};

export const updateFocus: (
  target: RefObject<HTMLInputElement>
) => void = target => {
  setTimeout(() => {
    if (target.current) {
      target.current.focus();
    }
  }, 10);
};

export const defaultOnFocus: (
  event: FocusEvent<HTMLInputElement>
) => void = event => {
  event.target.select();
};

export type EmptyString = '';

export const fillEmptyArray: (size: number) => EmptyString[] = size => {
  return Array(size).fill('');
};
