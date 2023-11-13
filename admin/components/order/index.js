import React from "react";
import SearchOrder from "./SearchOrder";
import OrderTable from "../placeOrder/OrderTable";

const Order = () => {
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
