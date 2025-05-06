import { useState } from 'react'
import dayjs from 'dayjs'

export const useDate = () => {
  // 当前选中的日期
  const [date, setDate] = useState(() => dayjs())
  // 控制日期选择器的显示和隐藏
  const [visible, setVisible] = useState(false)

  // 显示日期选择器
  const onShowDate = () => {
    setVisible(true)
  }

  // 隐藏日期选择器
  const onHideDate = () => {
    setVisible(false)
  }

  // 确认选择日期
  const onDateChange = (date) => {
    setDate(dayjs(date))
    setVisible(false)
  }

  return {
    date,
    visible,
    onDateChange,
    onShowDate,
    onHideDate
  }
} 