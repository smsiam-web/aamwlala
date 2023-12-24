import { Tooltip } from "@mantine/core";
import React, { useEffect, useState, useRef } from "react";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { Modal } from "@mantine/core";
import { FiEdit } from "react-icons/fi";
import { Pagination } from "@mantine/core";
import Link from "next/link";
import { db } from "@/app/utils/firebase";
import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { selectOrder, updateOrder } from "@/app/redux/slices/orderSlice";
import FormHeader from "../shared/FormHeader";
import Button from "../shared/Button";
import NotFound from "../shared/NotFound";
import { AiOutlinePrinter } from "react-icons/ai";
import { selectUser } from "@/app/redux/slices/authSlice";
import { generateStick, invoiceGenerate } from "@/admin/utils/helpers";
import { FaPrint } from "react-icons/fa";
import { updateConfig } from "@/app/redux/slices/configSlice";
import { useBarcode } from "next-barcode";

const OrderTable = () => {
  const [loading, setLoading] = useState(false);
  const [filterOrder, setFilterOrder] = useState(null);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState(useSelector(selectOrder));
  const [page, setPagee] = useState(1);
  const [opened, setOpened] = useState(false);
  const order = useSelector(selectOrder);
  const user = useSelector(selectUser);
  const [ID, setID] = useState(null);
  const [barCodeImageLink, setBarCodeImageLink] = useState(null);

  const toggleOpen = () => {
    opened ? setOpened(false) : setOpened(true);
  };

  const ref = useRef();

  const { inputRef } = useBarcode({
    value: ID,
    options: {
      background: "#FFFFFF",
      displayValue: false,
      width: 3,
      height: 80,
    },
  });

  useEffect(() => {
    setOrders(order);
  }, [order]);

  const setPage = (i) => {
    setPagee(i);
  };

  // Change Status from status Action
  const onStatusChanged = async (e, id) => {
    e.preventDefault();
    const status = e.target.value;
    orders.map((i) => {
      i.id === id && updateStatus(i, status, id);
    });
  };
  // Change Status from print Action and check print Status
  const statusUpdate = async (item) => {
    item.status === "Pending" && invoiceGenerate(item);

    item.status === "Pending"
      ? updateStatus(item, "Processing", item?.id)
      : toggleOpen;
    setFilterOrder(item);
    //   console.log(item);
  };
  // Change Status from print Action and check print Status
  const stickerStatus = async (item) => {
    await setID(item?.id);
    item.status === "Processing"
      ? updateStatus(item, "Shipped", item?.id)
      : toggleOpen;
    setFilterOrder(item);
    item.status === "Processing" && generateStick(item, inputRef?.current.src);
  };

  // update status on firebase
  const updateStatus = async (i, status, id) => {
    await db
      .collection("placeOrder")
      .doc(id)
      .set(
        {
          ...i,
          timestamp: i.timestamp,
          status: status,
        },
        { merge: true }
      );
    notifications.show({
      title: "Status Update successfully",
      message: `Customer Name, Order ID: #${id}`,
      color: "blue",
    });
  };

  // Get order from firebase database
  useEffect(() => {
    setLoading(true);
    const unSub = db
      .collection("placeOrder")
      .orderBy("timestamp", "desc")
      .limit(30)
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
        setLoading(false);
      });
    return () => {
      unSub();
    };
  }, []);

  //get config
  useEffect(() => {
    const unSub = db.collection("config").onSnapshot((snap) => {
      const configData = [];
      snap.docs.map((doc) => {
        configData.push(doc.data());
      });
      dispatch(updateConfig(configData));
    });
    return () => {
      unSub();
    };
  }, []);

  //after confirmaiton Delete porduct from firebase
  const DeleteProduct = async (item) => {
    await db
      .collection("placeOrder")
      .doc(item.id)
      .delete()
      .then(() => {
        toggleOpen();
        notifications.show({
          title: "Delete successfully",
          message: `Customer Name ${item.order_details.customer_name}, Order ID: #${item.id}`,
          color: "orange",
        });
      })
      .catch((error) => {
        console.error("Error removing document: (from orderTable)", error);
      });

    setFilterOrder(null);
  };

  return (
    <main>
      {/* confirmaiton pop-up */}
      <Modal
        opened={opened}
        withCloseButton={false}
        onClose={() => toggleOpen()}
        centered
      >
        <div className="p-2 rounded-lg">
          <FormHeader
            onClick={() => toggleOpen()}
            title={"Confirmation"}
            sub_title="Are you sure? You want to reprint this Invoice. Please check it carefully"
          />
          {/* confirmaiton pop-up  */}
          {filterOrder && (
            <div className="bg-gray-50 py-10">
              <div className="flex flex-col items-center gap-3">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold text-title">
                    {filterOrder?.customer_details?.customer_name}
                  </h1>
                  <h1 className="text-xs text-title">
                    {filterOrder?.customer_details?.phone_number}
                  </h1>
                  <h1 className="text-sm text-title">
                    {filterOrder?.customer_details?.customer_address}
                  </h1>
                  <h1 className="text-base font-semibold text-title">
                    <span className="text-lg font-bold">#</span>
                    {filterOrder?.id}
                  </h1>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-4">
                  <Button
                    onClick={() => toggleOpen()}
                    title="Cancel"
                    className="text-md bg-red-400 hover:bg-red-500 text-white px-8"
                  />
                  <Button
                    title="Yes, I'm Sure"
                    className="text-md bg-green-500 hover:bg-green-600 text-white px-8"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
      <div className="grid gap-4 w-full overflow-hidden ">
        <div className="hidden">
          <img ref={inputRef} alt="ok" />
        </div>
        <div className="w-full overflow-x-scroll rounded-md relative">
          {/* order table  */}
          {!orders.length ? (
            <NotFound text={"order"} />
          ) : (
            <table className="w-full whitespace-nowrap table-auto">
              <thead className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b border-gray-200  bg-gray-100">
                <tr>
                  <th className="px-4 py-3 ">invoice no</th>
                  <th className="px-4 py-3 ">SFC ID</th>
                  <th className="px-4 py-3 ">NAME</th>
                  <th className="px-4 py-3 ">Phone no.</th>
                  <th className="px-4 py-3 ">Delivery Type</th>
                  <th className="px-4 py-3 ">DISCOUNT</th>
                  <th className="px-4 py-3 ">Amount</th>
                  <th className="px-4 py-3 ">status</th>
                  <th
                    className={`px-4 py-3 ${
                      user.staff_role === "HR" || user.staff_role === "Admin"
                        ? ""
                        : "hidden"
                    }`}
                  >
                    Actions
                  </th>
                  <th className="px-4 py-3 ">Created at</th>
                  <th className="px-4 py-3 ">Created By</th>
                  <th className="px-4 py-3 ">invoice</th>
                  {(user.staff_role === "HR" ||
                    user.staff_role === "Admin") && (
                    <th className="px-4 py-3 ">ACTIONS</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 ">
                <>
                  {!!orders &&
                    orders?.map(
                      (item, index) =>
                        index >= 15 * page - 15 &&
                        index + 1 <= 15 * page && (
                          <tr
                            className={`${item?.isFilter && "bg-sky-200"} ${
                              item.status.toLowerCase() === "delivered" &&
                              "bg-green-200"
                            }`}
                            key={index}
                          >
                            <td className="px-4 py-3 font-bold">
                              {/* <Link href={`/admin/place-order/id=${item.id}`}> */}
                              <span className="text-sm">#{item.id}</span>
                              {/* </Link> */}
                            </td>
                            <td className="px-4 py-3 font-bold">
                              {/* <Link href={`/admin/place-order/id=${item.id}`}> */}
                              <span className="text-sm">{item.consignment_id ? item.consignment_id : "null"}</span>
                              {/* </Link> */}
                            </td> 

                            <td className="px-4 py-3">
                              <span className="text-sm ">
                                {item.customer_details?.customer_name}
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold ">
                                <a
                                  href={`tel:+88${item.customer_details?.phone_number}`}
                                >
                                  {item.customer_details?.phone_number}
                                </a>
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`${
                                  item?.customer_details?.delivery_type
                                    ? "bg-green-100 text-green-400"
                                    : "bg-slate-200 text-slate-500"
                                } text-xs uppercase font-serif font-medium px-2 py-1 rounded-full`}
                              >
                                {item?.customer_details?.delivery_type
                                  ? "Home Delivery"
                                  : "Point Delivery"}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold">
                                -{item?.discount}tk
                              </span>
                            </td>

                            <td className="px-4 py-3">
                              <span className="text-sm  font-bold">
                                {item.customer_details?.salePrice}tk
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-serif">
                                <span
                                  className={`${
                                    item.status.toLowerCase() === "pending" &&
                                    "text-gray-700 bg-gray-200"
                                  } ${
                                    item.status.toLowerCase() === "hold" &&
                                    "text-gray-700 bg-gray-200"
                                  } ${
                                    item.status.toLowerCase() ===
                                      "processing" &&
                                    "text-yellow-500 bg-yellow-100"
                                  } ${
                                    item.status.toLowerCase() === "shipped" &&
                                    "text-indigo-500 bg-indigo-100"
                                  } ${
                                    item.status.toLowerCase() === "delivered" &&
                                    "text-green-500 bg-green-100"
                                  } ${
                                    item.status.toLowerCase() === "returned" &&
                                    "bg-teal-100 text-teal-500"
                                  } ${
                                    item.status.toLowerCase() === "cancelled" &&
                                    "bg-red-100 text-red-500"
                                  } inline-flex px-2 text-xs capitalize font-medium leading-5 rounded-full`}
                                >
                                  {item.status}
                                </span>
                              </span>
                            </td>
                            <td
                              className={`px-4 py-3 text-center ${
                                user.staff_role === "HR" ||
                                user.staff_role == "Admin"
                                  ? ""
                                  : "hidden"
                              }`}
                            >
                              <select
                                className="block cursor-pointer  px-2 py-1  focus:outline-none  form-select  border-gray-200  focus:shadow-none focus:ring  leading-5 border  bg-gray-50 h-8 rounded-md text-xs w-28"
                                onChange={(e) => onStatusChanged(e, item.id)}
                              >
                                <option
                                  value={item.status}
                                  className="capitalize"
                                  hidden
                                >
                                  {item.status}
                                </option>

                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Hold">Hold</option>
                                <option value="Returned">Returned</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold">
                                {item.date}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold">
                                {item.placeBy}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <Link
                                href={`/admin/orders/invoice/id=${item.id}`}
                              >
                                <Tooltip label="Invoice" color="blue" withArrow>
                                  <span className="text-sub-title flex items-center justify-center font-semibold cursor-pointer hover:text-blue-400">
                                    <HiOutlineDocumentDownload size={18} />
                                  </span>
                                </Tooltip>
                              </Link>
                            </td>

                            {(user.staff_role === "HR" ||
                              user.staff_role === "Admin") && (
                              <td className="px-4 py-3">
                                <div className="text-sm font-semibold flex justify-start gap-5 text-sub-title items-center">
                                  {user.staff_role === "HR" && (
                                    <Tooltip
                                      label="Sticker"
                                      color="blue"
                                      withArrow
                                    >
                                      <span
                                        className="cursor-pointer hover:text-blue-400"
                                        onClick={() => stickerStatus(item)}
                                      >
                                        <FaPrint size={16} />
                                      </span>
                                    </Tooltip>
                                  )}

                                  <Link
                                    href={`/admin/orders/edit-order/id=${item.id}`}
                                  >
                                    <Tooltip
                                      label="Edit"
                                      color="blue"
                                      withArrow
                                    >
                                      <span className="cursor-pointer hover:text-blue-400">
                                        <FiEdit size={16} />
                                      </span>
                                    </Tooltip>
                                  </Link>

                                  <Tooltip
                                    label="Print"
                                    color="green"
                                    withArrow
                                  >
                                    <span
                                      className="cursor-pointer hover:text-blue-400"
                                      onClick={() => statusUpdate(item)}
                                    >
                                      <AiOutlinePrinter size={20} />
                                    </span>
                                  </Tooltip>
                                </div>
                              </td>
                            )}
                          </tr>
                        )
                    )}
                </>
              </tbody>
            </table>
          )}
        </div>
      </div>
      {orders?.length >= 15 && (
        <div className="bg-white py-3 justify-center flex">
          <Pagination
            total={Math.ceil(orders?.length / 15)}
            boundaries={1}
            defaultValue={page ? page : 1}
            onChange={(i) => setPage(i)}
          />
        </div>
      )}
    </main>
  );
};

export default OrderTable;
