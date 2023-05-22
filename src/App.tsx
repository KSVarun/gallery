import { useCallback, useLayoutEffect, useState } from 'react';
import './App.css';

let num = 1;
let timeout = 0;
let totalFiles = 0;
const defaultTimeGap = 5;

function later(delay: number) {
  return new Promise(function (resolve) {
    timeout = setTimeout(() => resolve(delay), delay * 1000);
  });
}

function App() {
  const [state, setState] = useState<{
    files: null | FileList;
    fileSrc: string;
  }>({
    files: null,
    fileSrc: '',
  });

  function updateState(index: number) {
    setState((state) => {
      if (!state.files || !state.files[index]) {
        return state;
      }

      return {
        ...state,
        fileSrc: URL.createObjectURL(state.files[index]),
      };
    });
  }

  const callAgain = useCallback((i: number) => {
    let nextTimeGap = i;
    if (nextTimeGap === 0) {
      nextTimeGap = defaultTimeGap;
    }
    later(i).then(() => {
      updateState(num);
      num = num + 1;
      callAgain(nextTimeGap);
    });
  }, []);

  useLayoutEffect(() => {
    let previousKeyPress: null | string = null;
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && num === 0) {
        return;
      }
      if (e.key === 'ArrowRight' && num === totalFiles - 1) {
        return;
      }
      if (e.key === ' ' && timeout !== 0) {
        clearTimeout(timeout);
        timeout = 0;
        previousKeyPress = e.key;
        return;
      }
      if (e.key === ' ' && timeout === 0) {
        if (previousKeyPress !== ' ') {
          num = num + 1;
        }
        callAgain(0);
        previousKeyPress = e.key;
        return;
      }
      if (e.key === 'ArrowLeft' && timeout !== 0) {
        clearTimeout(timeout);
        timeout = 0;
        const newNum = num - 2;
        num = newNum;
        if (newNum >= 0) {
          updateState(newNum);
        }
        previousKeyPress = e.key;
        return;
      }
      if (e.key === 'ArrowLeft' && timeout === 0) {
        const newNum = num - 1;
        num = newNum;
        if (newNum >= 0) {
          updateState(newNum);
        }
        previousKeyPress = e.key;
        return;
      }
      if (e.key === 'ArrowRight') {
        clearTimeout(timeout);
        timeout = 0;
        updateState(num);
        num = num + 1;
        previousKeyPress = e.key;
        return;
      }
    });
  }, [callAgain]);

  return (
    <div>
      {!state.files && (
        <input
          type='file'
          onChange={(e) => {
            setState((state) => {
              if (!e.target.files) {
                return state;
              }
              totalFiles = e.target.files.length;
              return {
                ...state,
                files: e.target.files,
                fileSrc: URL.createObjectURL(e.target.files[0]),
              };
            });
            callAgain(defaultTimeGap);
          }}
          id='file-path'
          name='file-path'
          multiple
        />
      )}
      {state.fileSrc && (
        <img
          src={state.fileSrc}
          style={{ height: '100vh', width: '100vw', objectFit: 'contain' }}
        />
      )}
    </div>
  );
}

export default App;
