export function getFormattedDate(createdAt: Date, showTime = true) {
  const date = createdAt;
  const now = new Date();
  console.log(createdAt);
  const diffDays = now.getDate() - date.getDate();
  const diffMonths = now.getMonth() - date.getMonth();
  const diffYears = now.getFullYear() - date.getFullYear();
  const time = date.toTimeString();
  let timeString: string = "";
  if (diffDays === 0 && diffMonths === 0 && diffYears === 0) {
    timeString = "Today";
  } else if (diffDays === 1 && diffMonths === 0 && diffYears === 0) {
    timeString = " Yesterday";
  } else if (diffDays > 1 && diffMonths === 0 && diffYears === 0) {
    timeString =
      date.toDateString().split(" ")[0] +
      ", " +
      date.toDateString().split(" ").slice(1, 3).join(" ");
  } else if (diffMonths > 0 && diffYears === 0) {
    timeString =
      date.toDateString().split(" ")[0] +
      ", " +
      date.toDateString().split(" ").slice(1, 4).join(" ");
  } else if (diffYears > 0) {
    timeString =
      date.toDateString().split(" ")[0] +
      ", " +
      date.toDateString().split(" ").slice(1, 4).join(" ");
  }

  if (showTime) {
    timeString += ", " + time.slice(0, 5);
  }
  console.log(createdAt, timeString, diffDays, diffMonths, diffYears);
  return timeString;
}

export function formatNumber(num:number, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(num);
}
