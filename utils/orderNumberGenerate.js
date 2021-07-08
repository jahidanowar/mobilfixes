const date = new Date();

const uniqueNumber = Math.floor(Math.random() * 10000);

const generateOrderNumber = () => {
  return [
    "MF",
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    uniqueNumber,
  ].join("");
};

module.exports = { generateOrderNumber }