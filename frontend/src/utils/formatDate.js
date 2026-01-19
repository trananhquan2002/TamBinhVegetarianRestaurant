export const formatDateTimeVN = (dateString) => {
  if (!dateString) return { time: '--:--', date: '--/--/----' }
  const dateObj = new Date(dateString)
  const time = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  const date = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  return { time, date }
}
