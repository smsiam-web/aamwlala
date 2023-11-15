import React, { useEffect, useState } from "react";
import Button from "@/app/components/shared/Button";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { db } from "@/app/utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { selectOrder, updateOrder } from "@/app/redux/slices/orderSlice";
import { daysInMonth } from "@/admin/utils/helpers";

const SearchBy = ({ onClick }) => {
  const [currentValue, setCurrentValue] = useState(null);
  const [orders, setOrders] = useState(useSelector(selectOrder));
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setCurrentValue(e.currentTarget.value);
  };

  // search config
  useEffect(() => {
    let ss = [];
    if (!currentValue) {
      dispatch(updateOrder(orders));
      ss = [];
      return;
    }

    const res = orders.map((i) => {
      if (
        i.customer_details.customer_name
          .toLowerCase()
          .split(" ")
          .includes(currentValue?.toLowerCase())
      ) {
        ss.push({ ...i, isFilter: true });
      } else if (i.customer_details.phone_number === currentValue) {
        ss.push({ ...i, isFilter: true });
      } else if (i.id.toLowerCase() === currentValue.toLowerCase()) {
        ss.push({ ...i, isFilter: true });
      } else if (
        i.customer_details.customer_name.toLowerCase() ===
        currentValue.toLowerCase()
      ) {
        ss.push({ ...i, isFilter: true });
      } else if (
        i.customer_details.customer_address
          .toLowerCase()
          .split(" ")
          .includes(currentValue?.toLowerCase())
      ) {
        ss.push({ ...i, isFilter: true });
      } else if (i.date === currentValue) {
        ss.push({ ...i, isFilter: true });
      }
    });

    ss.length ? dispatch(updateOrder(ss)) : dispatch(updateOrder(orders));
  }, [currentValue]);

  // onStatus config
  const onStatusChanged = (e) => {
    e.preventDefault();
    let status = [];

    const res = orders.map((i) => {
      if (
        i.status.toLowerCase() === e.target.value.toLowerCase() ||
        e.target.value === "Status"
      ) {
        status.push({ ...i });
      }
    });

    status.length ? dispatch(updateOrder(status)) : dispatch(updateOrder([]));
  };

  // onLimits Config
  const onLimitChanged = (e) => {
    e.preventDefault();
    // if(e.target.value === "All"){
    //   return;
    // }
    let limits = [];
    const date = new Date();
    const dateAgo = parseInt(e.target.value) - 1;

    const res = orders.map((item) => {
      if (item.timestamp.toDate().getMonth() === date.getMonth()) {
        if (item.timestamp.toDate().getDate() >= date.getDate() - dateAgo) {
          limits.push(item);
        }
      }

      if (
        date.getDate() - dateAgo < 1 &&
        date.getMonth() - 1 === item.timestamp.toDate().getMonth()
      ) {
        if(item.timestamp.toDate().getDate() >= (daysInMonth(date.getMonth() - 1, date.getFullYear()) +
        date.getDate()) -
        dateAgo){
          limits.push(item)
        }
      }
    });
    limits.length ? dispatch(updateOrder(limits)) : dispatch(updateOrder(orders));
  };

  // Get Order details from firebase and update on REDUX
  useEffect(() => {
    const unSub = db
      .collection("placeOrder")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const getOrder = [];
        snap.docs.map((doc) => {
          getOrder.push({
            id: doc.id,
            ...doc.data(),
            // timestamp: doc.data().timestamp?.toDate()?.getTime(),
          });
        });
        setOrders(getOrder);
      });

    return () => {
      unSub();
    };
  }, []);

  return (
    <>
      <div className="min-w-0 rounded-lg overflow-hidden bg-gray-50  shadow-xs  mb-5">
        <div className="p-4">
          <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <div className="flex-grow-0  md:flex-grow lg:flex-grow xl:flex-grow">
                <input
                  className="block w-full px-3 py-1 text-sm focus:outline-neutral-200 leading-5 rounded-md  border-gray-200 h-14 bg-gray-100 border-transparent focus:bg-white"
                  type="text"
                  onChange={(e) => handleChange(e)}
                  placeholder="Search by #ID / Name / Contact"
                />
              </div>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-2 py-1 text-sm  focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200  focus:shadow-none leading-5 border h-14 bg-gray-100 border-transparent focus:bg-gray-50"
                id="roleItem"
                name="roleItem"
                // defaultValue={selectedSubNav}
                onChange={(e) => onStatusChanged(e)}
              >
                <option>Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-2 py-1 text-sm  focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200  focus:shadow-none leading-5 border h-14 bg-gray-100 border-transparent focus:bg-white"
                onChange={(e) => onLimitChanged(e)}
              >
                <option value="All">Order limits</option>
                <option value="1">Today's orders</option>
                <option value="7">Last 7 days orders</option>
                <option value="10">Last 10 days orders</option>
                <option value="15">Last 15 days orders</option>
                <option value="30">Last 30 days orders</option>
              </select>
            </div>

            <div className="w-full md:w-56 lg:w-56 xl:w-56">
              <Button
                onClick={onClick}
                title="Place Order"
                className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg transition-all duration-300 text-white w-full h-14"
                icon=<AiOutlineAppstoreAdd size={24} />
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBy;
