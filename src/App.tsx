import { useCallback, useLayoutEffect, useState } from 'react';
import './App.css';

let num = 1;
let timeout = 0;
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

  const callAgain = useCallback((i: number) => {
    let nextTimeGap = i;
    if (nextTimeGap === 0) {
      nextTimeGap = defaultTimeGap;
    }
    later(i).then(() => {
      setState((state) => {
        if (!state.files || !state.files[num]) {
          return state;
        }

        return {
          ...state,
          fileSrc: URL.createObjectURL(state.files[num]),
        };
      });
      num = num + 1;
      callAgain(nextTimeGap);
    });
  }, []);

  useLayoutEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' && timeout !== 0) {
        clearTimeout(timeout);
        timeout = 0;
        return;
      }
      if (e.key === ' ' && timeout === 0) {
        callAgain(0);
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
