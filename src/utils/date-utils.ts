const getBeginningCurrentMonth = () => {
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0);
  thisMonth.setMinutes(0);
  thisMonth.setSeconds(0);
  return thisMonth;
};

export {
  getBeginningCurrentMonth,
};
