import { NavBar, DatePicker } from "antd-mobile";
import { useEffect, useMemo, useState } from "react";
import classnames from "classnames"; //classnames库用来动态管理和拼接 CSS 类名
import "./index.scss";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import _ from "lodash";
import DailyBill from "./components/dayBill";

const Month = () => {
  //按月做数据的分组
  const billList = useSelector((state) => state.bill.billList);
  const monthGroup = useMemo(() => {
    //return一个计算之后的值
    return _.groupBy(billList, (item) => dayjs(item.date).format("YYYY-MM"));
  }, [billList]);
  // console.log(billList);

  const [dateVisible, setDateVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs(new Date()).format("YYYY-MM");
  });

  const [currentMonthList, setCurrentMonthList] = useState([]);

  const monthResult = useMemo(() => {
    //支出 /收入 /结余
    const pay = currentMonthList
      .filter((item) => item.type === "pay")
      .reduce((a, c) => a + c.money, 0);
    const income = currentMonthList
      .filter((item) => item.type === "income")
      .reduce((a, c) => a + c.money, 0);
    return { pay, income, total: pay + income };
  }, [currentMonthList]);

  //初始化时把当前月数据显示出来
  useEffect(() => {
    const nowDate = dayjs().format("YYYY-MM");
    if (monthGroup[nowDate]) {
      setCurrentMonthList(monthGroup[nowDate]);
    }
  }, [monthGroup]);

  const onConfirm = (date) => {
    setDateVisible(false);
    //其他逻辑
    // console.log(date);
    const formatDate = dayjs(date).format("YYYY-MM");
    setCurrentMonthList(monthGroup[formatDate]);
    setCurrentDate(formatDate);
  };

  // 当前月按照日来做分组
  const dayGroup = useMemo(() => {
    //return一个计算之后的值
    const groupData = _.groupBy(currentMonthList, (item) =>
      dayjs(item.date).format("YYYY-MM-DD ")
    );
    const keys = Object.keys(groupData); //调取对象时间的方法
    return {
      groupData,
      keys,
    };
  }, [currentMonthList]);

  return (
    <div className="monthlyBill">
      <NavBar className="nav" backArrow={false}>
        月度收支
      </NavBar>
      <div className="content">
        <div className="header">
          {/* 时间切换区域 */}
          <div className="date" onClick={() => setDateVisible(true)}>
            <span className="text">{currentDate + ""}月账单</span>
            {/* 日期对象不能直接渲染，加个字符串转换格式 */}
            {/* 思路：根据当前弹窗打开的状态控制expand类名是否存在 */}
            <span
              className={classnames("arrow", dateVisible ? "expand" : "")}
            ></span>
          </div>
          {/* 统计区域 */}
          <div className="twoLineOverview">
            <div className="item">
              <span className="money">{monthResult.pay.toFixed(2)}</span>
              <span className="type">支出</span>
            </div>
            <div className="item">
              <span className="money">{monthResult.income.toFixed(2)}</span>
              <span className="type">收入</span>
            </div>
            <div className="item">
              <span className="money">{monthResult.total.toFixed(2)}</span>
              <span className="type">结余</span>
            </div>
          </div>
          {/* 时间选择器 */}
          <DatePicker
            className="kaDate"
            title="记账日期"
            precision="month"
            visible={dateVisible}
            onCancel={() => setDateVisible(false)}
            onConfirm={onConfirm}
            onClose={() => setDateVisible(false)}
            max={new Date()}
          />
        </div>
        {/* 单日列表统计 */}
        {dayGroup.keys.map((key) => {
          return (
            <DailyBill
              key={key}
              date={key}
              billList={dayGroup.groupData[key]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Month;
