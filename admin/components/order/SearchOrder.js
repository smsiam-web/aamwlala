import React from "react";
import Button from "../shared/Button";
import { BsCloudDownload } from "react-icons/bs";
import SearchBy from "../placeOrder/SearchBy";

const SearchOrder = () => {
  return (
    <SearchBy />
    // <div className="min-w-0 rounded-lg overflow-hidden bg-gray-50  shadow-xs  mb-5">
    //   <div className="p-4">
    //     <div className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
    //       <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
    //         <input
    //           className="block w-full px-3 py-1 text-sm focus:outline-neutral-200 leading-5 rounded-md  border-gray-200 h-14  bg-gray-100 border-transparent focus:bg-white"
    //           type="search"
    //           // name="search"
    //           placeholder="Search by phone"
    //         />
    //       </div>
    //       <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
    //         <select className="block w-full px-2 py-1 text-sm  focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200  focus:shadow-none leading-5 border h-14 bg-gray-100 border-transparent focus:bg-white">
    //           <option value="All" hidden="Status">
    //             Status
    //           </option>
    //           <option value="pending">Pending</option>
    //           <option value="delivered">Delivered</option>
    //           <option value="processing">Processing</option>
    //           <option value="cancel">Cancel</option>
    //         </select>
    //       </div>
    //       <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
    //         <select className="block w-full px-2 py-1 text-sm  focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200  focus:shadow-none leading-5 border h-14 bg-gray-100 border-transparent focus:bg-white">
    //           <option value="All" hidden="Order limits">
    //             Order limits
    //           </option>
    //           <option value="1">Today's orders</option>
    //           <option value="7">Last 7 days orders</option>
    //           <option value="10">Last 10 days orders</option>
    //           <option value="15">Last 15 days orders</option>
    //           <option value="30">Last 30 days orders</option>
    //         </select>
    //       </div>
    //       <div className="w-full md:w-56 lg:w-56 xl:w-56">
    //         <Button
    //           title="Download all orders"
    //           className="bg-blue-400 hover:bg-blue-500 outline-none hover:shadow-xl transition-all duration-300 !py-1 !font-medium text-white w-full h-14"
    //           icon=<BsCloudDownload size={24} />
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default SearchOrder;
