const parseArgs = () => {
  const [arg1, val1, arg2, val2] = process.argv.slice(2);

  console.log(`${arg1.slice(2)} is ${val1}, ${arg2.slice(2)} is ${val2}`);
};

parseArgs();
