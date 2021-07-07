import R from 'ramda';

// (Promise, Callback, Options?) => Promise | void
//
// Options: { no_spread: bool }
//   no_spread: prevents wrapPromise from applying array-like return arguments
//              to the callback.
var wrapPromise = async function(promise: Promise<any>, cb: (arg0: null, arg1: undefined) => void, options: { no_spread?: any; } | undefined) {
  if (!options) {
    options = {};
  }

  if (cb) {
    try {
          const args = await promise;
          
          if (R.isArrayLike(args) && !options.no_spread) {
              // call outside of promise stack
              setImmediate(function () {
                  R.apply(R.partial(cb, [null]), args);
              });
          } else {
              setImmediate(function () {
                  cb(null, args);
              });
          }
      } catch (err) {
          setImmediate(function () {
              cb(err);
          });
      }
  }
  return promise;
};

export {
    wrapPromise
};
