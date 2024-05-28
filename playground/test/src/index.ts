import { UAParser, createSignal, effect } from '@alilc/lowcode-shared';
import { History, Hotkey } from '@alilc/lowcode-editor-core';

const parser = new UAParser().getResult();
console.log('%c [ parser ]-5', 'font-size:13px; background:pink; color:#bf2c9f;', parser);

const hotkey = new Hotkey();
hotkey.mount(window);

const signal = createSignal(0);

effect(() => {
  console.log('effect ', signal.value);
});

const history = new History(signal, (value) => {
  signal.value = value;
  console.log('redo', value);
});

const button1 = document.createElement('button');
button1.innerHTML = 'click';
button1.onclick = () => {
  signal.value++;
};

document.getElementById('app')!.append(button1);

hotkey.bind(['command+z'], () => {
  console.log('undo');
  history.back();
  return false;
});

hotkey.bind(['command+shift+z'], () => {
  console.log('redo');
  history.forward();
  return false;
});
