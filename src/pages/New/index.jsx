import { Button, DatePicker, Input, NavBar } from "antd-mobile";
import Icon from "@/mainComponents/Icon";
import "./index.scss";
import classnames from "classnames";
import { billListData } from "@/contants";
import { useNavigate } from "react-router";
import { useState } from "react";
import { addBillList } from "@/store/modules/billStore";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

const New = () => {
  const navigate = useNavigate();
  const [billtype, setBilltype] = useState("pay");
  const [money, setMoney] = useState(0);
  const moneyChange = (value) => {
    setMoney(value);
  };
  const [useFor, setUseFor] = useState("");
  const dispatch = useDispatch();
  const saveBill = () => {
    const data = {
      type: billtype,
      money: billtype === "pay" ? -money : +money,
      date: date,
      useFor: useFor,
    };
    dispatch(addBillList(data));
  };

  // 存储我们选择的时间
  const [date, setDate] = useState();
  // 控制时间打开和关闭
  const [dateVisible, setDateVisible] = useState(false);
  // 确认选择时间
  const dateConfirm = (value) => {
    console.log(value);
    setDate(value);
    setDateVisible(false);
  };

  return (
    <div className="keepAccounts">
      <NavBar className="nav" onBack={() => navigate(-1)}>
        记一笔
      </NavBar>

      <div className="header">
        <div className="kaType">
          <Button
            shape="rounded"
            className={classnames(billtype === "pay" ? "selected" : "")}
            onClick={() => setBilltype("pay")}
          >
            支出
          </Button>
          <Button
            className={classnames(billtype === "income" ? "selected" : "")}
            shape="rounded"
            onClick={() => setBilltype("income")}
          >
            收入
          </Button>
        </div>

        <div className="kaFormWrapper">
          <div className="kaForm">
            <div className="date">
              <Icon type="calendar" className="icon" />

              <span className="text" onClick={() => setDateVisible(true)}>
                {dayjs(date).format("YYYY-MM-DD")}
              </span>
              {/* 时间选择器 */}
              <DatePicker
                className="kaDate"
                title="记账日期"
                max={new Date()}
                visible={dateVisible}
                onConfirm={dateConfirm}
              />
            </div>
            <div className="kaInput">
              <Input
                className="input"
                placeholder="0.00"
                type="number"
                value={money}
                onChange={moneyChange}
              />
              <span className="iconYuan">¥</span>
            </div>
          </div>
        </div>
      </div>

      <div className="kaTypeList">
        {billListData[billtype].map((item) => {
          return (
            <div className="kaType" key={item.type}>
              <div className="title">{item.name}</div>
              <div className="list">
                {item.list.map((item) => {
                  return (
                    <div
                      className={classnames(
                        "item",
                        useFor === item.type ? "selected" : ""
                      )}
                      key={item.type}
                      onClick={() => setUseFor(item.type)}
                    >
                      <div className="icon">
                        <Icon type={item.type} />
                      </div>
                      <div className="text">{item.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="btns">
        <Button className="btn save" onClick={saveBill}>
          保 存
        </Button>
      </div>
    </div>
  );
};

export default New;
