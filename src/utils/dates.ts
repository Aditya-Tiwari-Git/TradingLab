export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
export const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0)

export const getCalendarDays = (date: Date) => {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  const startWeekday = start.getDay()
  const totalDays = end.getDate()
  const days: { date: Date; isCurrentMonth: boolean }[] = []

  for (let i = 0; i < startWeekday; i += 1) {
    const day = new Date(start)
    day.setDate(day.getDate() - (startWeekday - i))
    days.push({ date: day, isCurrentMonth: false })
  }

  for (let day = 1; day <= totalDays; day += 1) {
    days.push({ date: new Date(date.getFullYear(), date.getMonth(), day), isCurrentMonth: true })
  }

  const remainder = 7 - (days.length % 7)
  if (remainder < 7) {
    for (let i = 0; i < remainder; i += 1) {
      const day = new Date(end)
      day.setDate(day.getDate() + i + 1)
      days.push({ date: day, isCurrentMonth: false })
    }
  }

  return days
}

export const formatDate = (date: Date) => date.toISOString().split('T')[0]
