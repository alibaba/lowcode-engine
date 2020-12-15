import { fireEvent } from '@testing-library/react';

it('test', () => {
  document.addEventListener('keydown', (e) => {
    console.log(e);
  })

  fireEvent.keyDown(document, { key: 'Enter',  })

  document.addEventListener('drag', (e) => {
    console.log(e);
  })
  fireEvent.drag(document, {})
})