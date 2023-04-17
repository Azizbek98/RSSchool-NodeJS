const parseEnv = () => {
  // Default case for env variables
  process.env.RSS_name1 = "value1";
  process.env.RSS_name2 = "value2";

  const varsEnv = Object.keys(process.env)
    .filter((index) => index.startsWith("RSS_"))
    .reduce((obj, index) => {
      obj[index] = process.env[index];
      return obj;
    }, {});

  const rssVars = Object.entries(varsEnv).map(
    ([index, value]) => `RSS_${index.substring(4)}=${value}`
  );

  console.log(`${rssVars[0]}; ${rssVars[1]}`);
};

parseEnv();
