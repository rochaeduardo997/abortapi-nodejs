import assert from 'assert';

const url = 'http://localhost:3000';

async function race(request, limitTimeout){
  const limiter = new Promise((r, reject) => setTimeout(reject, limitTimeout));

  return Promise.race([
    request,
    limiter
  ]);
}

{
  const limitTimeout = 100;
  assert.rejects(async () => {
    const fetchResult  = await race(fetch(url), limitTimeout);

    return fetchResult.json();
  });
}

{
  const limitTimeout = 500;
  const fetchResult  = await race(fetch(url), limitTimeout);
  const result = await fetchResult.json();

  const expected = {
    name: 'carlim',
    age: 25,
    profession: 'software developer'
  };

  assert.deepStrictEqual(result, expected, 'object must have the same value');
}

