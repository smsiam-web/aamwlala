import React, {useEffect} from "react";
import SearchOrder from "./SearchOrder";
import OrderTable from "../placeOrder/OrderTable";
import { db } from "@/app/utils/firebase";
import { useDispatch } from "react-redux";
import { updateOrder } from "@/app/redux/slices/orderSlice";

const Order = () => {
const dispatch = useDispatch();
    // Get order from firebase database
    useEffect(() => {

      const unSub = db
        .collection("placeOrder")
        .orderBy("timestamp", "desc")
        .limit(500)
        .onSnapshot((snap) => {
          const order = [];
          snap.docs.map((doc) => {
            order.push({
              id: doc.id,
              ...doc.data(),
              // timestamp: doc.data().timestamp?.toDate().getTime(),
            });
          });
          dispatch(updateOrder(order));
     
        });
      return () => {
        unSub();
      };
    }, []);

  return (
    <main>
      <div className="grid mx-auto">
        <h1 className="mb-3 text-lg font-bold text-gray-700 ">Orders</h1>
        <SearchOrder />
        <OrderTable />
      </div>
    </main>
  );
};

export default Order;
