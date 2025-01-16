export default {
  spacing: new Array(40).fill(1).reduce((acc, cur, idx) => {
    return {
      ...acc,
      [idx + 1]: (idx + 1) * 0.25 + "rem",
    };
  }, {}),
};
