const p = new Promise((res, rej) => {
  res("Haha");
});

const data = await p;
console.log(data);
