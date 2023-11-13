import { Tooltip } from "@mantine/core";
import React from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaFileInvoice } from "react-icons/fa";

const OrderList = () => {
  return (
    <div className="grid gap-4 w-full overflow-hidden">
      {/* <h1 className="text-title pb-4 text-2xl font-medium">Recent Order</h1> */}
      <div className="w-full overflow-x-scroll rounded-md">
        <table className="w-full whitespace-nowrap table-auto">
          <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200  bg-gray-100">
            <tr>
              <td className="px-4 py-3 ">SL No</td>
              <td className="px-4 py-3 ">Time</td>
              <td className="px-4 py-3 ">Name</td>
              <td className="px-4 py-3 ">SHIPPING ADDRESS</td>
              <td className="px-4 py-3 ">PHONE</td>
              <td className="px-4 py-3 ">AMOUNT</td>
              <td className="px-4 py-3 ">METHOD</td>
              <td className="px-4 py-3 ">STATUS</td>
              <td className="px-4 py-3 ">ACTION</td>
              <td className="px-4 py-3 ">Payment</td>
              <td className="px-4 py-3 ">Order ID</td>
              <td className="px-4 py-3 ">INVOICE</td>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 ">
            <tr className="">
              <td className="px-4 py-3">
                <span className="text-sm">01</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm ">06 March, 2023</span>
              </td>
              <td className="px-4 py-3 flex items-center justify-start gap-2">
                <span>গোপালভোগ আম</span>
              </td>

              <td className="px-4 py-3">
                <span className="">Kahaloo Upazila, Kahaloo, Bogura</span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm flex items-center justify-center font-medium">
                  +880 1722 166051
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm flex items-center justify-center font-medium text-primary">
                  <span>
                    <TbCurrencyTaka size={18} />
                  </span>
                  2080
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm flex items-center justify-center font-medium">
                  COD
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="font-serif">
                  <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-yellow-600 bg-yellow-100">
                    Pending
                  </span>
                </span>
              </td>
              <td className="px-4 py-3  text-center">
                <select className="block w-28 px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 focus:shadow-none leading-5 border bg-gray-50 h-8 ">
                  <option value="status" hidden>
                    Pending
                  </option>
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Cancel">Cancel</option>
                </select>
              </td>
              <td className="px-4 py-3">
                <span className="font-serif">
                  <span className="inline-flex px-2 text-xs font-medium leading-5 rounded-full text-yellow-600 bg-yellow-100">
                    Pending
                  </span>
                </span>
              </td>
              <td className="px-4 py-3 flex items-center justify-start">
                <span className="text-sm">ajdkfjdf</span>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm font-semibold flex justify-center text-sub-title items-center">
                  <Tooltip label="View Invoice" color="blue" withArrow>
                    <span className="cursor-pointer hover:text-blue-400">
                      <FaFileInvoice size={20} />
                    </span>
                  </Tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
