import assert from 'assert';

const url = 'http://localhost:3000';

const tracker = new assert.CallTracker();
process.on('exit', () => tracker.verify());

{
  const limitTimeout = 100;
  const abortController = new AbortController();

  setTimeout(() => abortController.abort(), limitTimeout);

  assert.rejects(async () => {
    const fetchResult = await fetch(url, {
      signal: abortController.signal
    });

    return fetchResult.json();
  },{
    name:    'AbortError',
    message: 'The operation was aborted'
  });
}

{
  const limitTimeout = 100;
  const signal = AbortSignal.timeout(limitTimeout);

  assert.rejects(async () => {
    const fetchResult = await fetch(url, {
      signal
    });

    return fetchResult.json();
  },{
    name:    'AbortError',
    message: 'The operation was aborted'
  });
}

{
  const limitTimeout = 100;
  const signal = AbortSignal.timeout(limitTimeout);
  const expectedCount = 1;
  signal.onabort = tracker.calls(expectedCount);

  assert.rejects(async () => {
    const fetchResult = await fetch(url, {
      signal
    });

    return fetchResult.json();
  },{
    name:    'AbortError',
    message: 'The operation was aborted'
  });
}

{
  const limitTimeout = 500;
  const signal = AbortSignal.timeout(limitTimeout);

  const fetchResult = await fetch(url, {
    signal
  });

  const result = await fetchResult.json();

  const expected = {
    name: 'carlim',
    age: 25,
    profession: 'software developer'
  };

  assert.deepStrictEqual(result, expected, 'object must have the same value');
}
