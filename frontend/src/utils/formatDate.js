export const formatDateTimeVN = (dateString) => {
  if (!dateString) return { time: '--:--', date: '--/--/----' }

  // ÉP timezone VN
  const dateObj = new Date(dateString + '+07:00')

  const time = dateObj.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh',
  })

  const date = dateObj.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  })

  return { time, date }
}
