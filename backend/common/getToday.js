function getToday() {
  const now = new Date();
  date = {
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear()
  };
  return ({ day, month, year } = date);
}

module.exports.getToday = getToday;
