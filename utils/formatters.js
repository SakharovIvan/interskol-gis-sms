const sqlformatdate = (number = 0) => {
  let now = new Date();
  now.setDate(now.getDate() - number);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  month <= 9 ? (month = `0${month}`) : (month = month);
  return `${day}-${month}-${year}`;
};

function datedif(srt, srt2 = new Date()) {
  if (!srt) {
    return;
  }

  const array = srt.split("-");
  const srt_date = new Date(
    array[2],
    Number(array[1]) - 1,
    Number(array[0]) + 1
  );

  if (!(srt2 instanceof Date)) {
    const array2 = srt2.split("-");
    const srt_date2 = new Date(
      array2[2],
      Number(array2[1]) - 1,
      Number(array2[0]) + 1
    );
    return Math.floor((srt_date -srt_date2 ) / (24 * 3600 * 1000));
  }
  return Math.floor((srt2 - srt_date) / (24 * 3600 * 1000));
}

const normalizeTlf = (tlf) => {
  return `${tlf}`
    .replace(/\)/g, "")
    .replace(/\(/g, "")
    .replace(/ /g, "")
    .replace(/\+/g, "");
};

export { sqlformatdate, normalizeTlf, datedif };

