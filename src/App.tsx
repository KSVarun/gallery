import { useState } from 'react';
import './App.css';

function later(delay: number) {
  return new Promise(function (resolve) {
    setTimeout(() => resolve(delay), delay * 1000);
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
  let num = 1;

  function callAgain(i: number) {
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
      callAgain(i);
    });
  }

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
            callAgain(8);
          }}
          id='file-path'
          name='file-path'
          multiple
        />
      )}
      {state.fileSrc && (
        <img
          src={state.fileSrc}
          style={{ height: '100vh', width: '100vw', objectFit: 'cover' }}
        />
      )}
    </div>
  );
}

export default App;
