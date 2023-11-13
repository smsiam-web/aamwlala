import React, { useEffect, useState } from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

//get hard coded program object

import Button from "./Button";
import {TodayDate} from "../../utils/helpers"
import { useSelector } from "react-redux";
import { selectOrder } from "@/app/redux/slices/orderSlice";


const ExportCSV = ({item}) => {
    const [order, setOrder] = useState();
    const [PROGRAM, setProgram] = useState(null);
    const ORDER = useSelector(selectOrder);

  const DEFAULT_FILENAME = TodayDate();


  useEffect(() => {
   setOrder(ORDER)
  }, [ORDER]);

  useEffect(() => {
    FilterOrder()
  }, [order]);

//   console.log(order);
//   console.log(PROGRAM)

 const FilterOrder = () => {
    const SS = [];
    order?.map(item => {
        const i = {
            Invoice: item.id,
            Name: item.customer_details.customer_name,
            Address: item.customer_details.customer_address,
            Phone: item.customer_details.phone_number,
            Amount: item.totalPrice,
            Note: item.customer_details.delivery_type ? "Home Delivery" : "Point Delivery"
        }
        SS.push(i);
    })
    setProgram(SS.reverse());
 }

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = async () => {
    FilterOrder();
    const ws =  XLSX.utils.json_to_sheet(PROGRAM);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, DEFAULT_FILENAME + fileExtension);
    // setProgram(null)
  };

  return <Button
  onClick= {(e) => exportToCSV()}
  title="Download"
  className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg transition-all duration-300 text-white w-full h-14"
/>;
};

export default ExportCSV;