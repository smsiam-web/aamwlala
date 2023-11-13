import { jsPDF } from "jspdf";

// create random unique id
export const uuid = () => {
  return "xxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const formatDate = (date) => {
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let dd = date.getDate();
  let mm = month[date.getMonth()];
  let yyyy = date.getFullYear();
  if(dd<10) {dd='0'+dd}
  if(mm<10) {mm='0'+mm}
  date = `${mm} ${dd}, ${yyyy}`;
  return date
}

export const Last7Days = () => {

    const today = new Date();
    const oneDayAgo = new Date(today);
    const twoDaysAgo = new Date(today);
    const threeDaysAgo = new Date(today);
    const fourDaysAgo = new Date(today);
    const fiveDaysAgo = new Date(today);
    const sixDaysAgo = new Date(today);

    oneDayAgo.setDate(today.getDate() - 1);
    twoDaysAgo.setDate(today.getDate() - 2);
    threeDaysAgo.setDate(today.getDate() - 3);
    fourDaysAgo.setDate(today.getDate() - 4);
    fiveDaysAgo.setDate(today.getDate() - 5);
    sixDaysAgo.setDate(today.getDate() - 6);

    const result0 = formatDate(today);
    const result1 = formatDate(oneDayAgo);
    const result2 = formatDate(twoDaysAgo);
    const result3 = formatDate(threeDaysAgo);
    const result4 = formatDate(fourDaysAgo);
    const result5 = formatDate(fiveDaysAgo);
    const result6 = formatDate(sixDaysAgo);

    const result = [result0,result1,result2,result3,result4,result5,result6]

    return(result.reverse());
}

export const Today = () => {
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let date = new Date();
  let dd = date.getDate();
  let mm = month[date.getMonth()];
  let yyyy = date.getFullYear();
  if(dd<10) {dd='0'+dd}
  if(mm<10) {mm='0'+mm}
  date = `${mm} ${dd}, ${yyyy}`;
  return date;
}
export const TimeStampToDate = (itmestamp) => {
  const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  let date = itmestamp.toDate();
  let dd = date.getDate();
  let mm = month[date.getMonth()];
  let yyyy = date.getFullYear();
  if(dd<10) {dd='0'+dd}
  if(mm<10) {mm='0'+mm}
  date = `${mm} ${dd}, ${yyyy}`;

  return date;

}

export const ToDateAndTime = (itmestamp) => {
  let date = itmestamp.toDate();
  let dateStr = date.toDateString();
  let timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });;

  date = `${dateStr} at ${timeStr}`;

  return date;

}

export const TodayDate = () => {
  let date = new Date();
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yyyy = date.getFullYear();
  if(dd<10) {dd='0'+dd}
  if(mm<10) {mm='0'+mm}
  date = `${dd}-${mm}-${yyyy}`;
  return date;
}

export const doubleDigit = (value) => {
   return value && value > 9 ? value : `0${value}`
}

export const daysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
}

export const invoiceGenerate = (item) => {

    const doc = new jsPDF();

        // get item_01
    let item_01 = doc.splitTextToSize(
      document.getElementById("item_01").innerText || "",
      200
    );
    let item_01_quantity = doc.splitTextToSize(
      document.getElementById("item_01_quantity")?.innerText || "",
      200
    );
    let item_01_price = doc.splitTextToSize(
      document.getElementById("item_01_price")?.innerText || "",
      200
    );
    let item_01_total_price = doc.splitTextToSize(
      document.getElementById("item_01_total_price")?.innerText || "",
      200
    );
     // get item_02
     let item_02 = doc.splitTextToSize(
      document.getElementById("item_02")?.innerText || "",
      200
    );
    let item_02_quantity = doc.splitTextToSize(
      document.getElementById("item_02_quantity")?.innerText || "",
      200
    );
    let item_02_price = doc.splitTextToSize(
      document.getElementById("item_02_price")?.innerText || "",
      200
    );
    let item_02_total_price = doc.splitTextToSize(
      document.getElementById("item_02_total_price")?.innerText || "",
      200
    );
    // get item_03
    let item_03 = doc.splitTextToSize(
      document.getElementById("item_03")?.innerText || "",
      200
    );
    let item_03_quantity = doc.splitTextToSize(
      document.getElementById("item_03_quantity")?.innerText || "",
      200
    );
    let item_03_price = doc.splitTextToSize(
      document.getElementById("item_03_price")?.innerText || "",
      200
    );
    let item_03_total_price = doc.splitTextToSize(
      document.getElementById("item_03_total_price")?.innerText || "",
      200
    );
    // get item_04
    let item_04 = doc.splitTextToSize(
      document.getElementById("item_04")?.innerText || "",
      200
    );
    let item_04_quantity = doc.splitTextToSize(
      document.getElementById("item_04_quantity")?.innerText || "",
      200
    );
    let item_04_price = doc.splitTextToSize(
      document.getElementById("item_04_price")?.innerText || "",
      200
    );
    let item_04_total_price = doc.splitTextToSize(
      document.getElementById("item_04_total_price")?.innerText || "",
      200
    );
    // get item_05
    let item_05 = doc.splitTextToSize(
      document.getElementById("item_05")?.innerText || "",
      200
    );
    let item_05_quantity = doc.splitTextToSize(
      document.getElementById("item_05_quantity")?.innerText || "",
      200
    );
    let item_05_price = doc.splitTextToSize(
      document.getElementById("item_05_price")?.innerText || "",
      200
    );
    let item_05_total_price = doc.splitTextToSize(
      document.getElementById("item_05_total_price")?.innerText || "",
      200
    );
    // get item_06
    let item_06 = doc.splitTextToSize(
      document.getElementById("item_06")?.innerText || "",
      200
    );
    let item_06_quantity = doc.splitTextToSize(
      document.getElementById("item_06_quantity")?.innerText || "",
      200
    );
    let item_06_price = doc.splitTextToSize(
      document.getElementById("item_06_price")?.innerText || "",
      200
    );
    let item_06_total_price = doc.splitTextToSize(
      document.getElementById("item_06_total_price")?.innerText || "",
      200
    );


    // doc.text(document.querySelector(".content > h1").innerHTML, 5, 75);
    doc.addImage("/invoice/invoice.jpg", 0, 0, 210, 297);
    doc.text(item.id, 43, 83.5);
    doc.text(item.status, 91, 77);
    doc.text(item?.customer_details.customer_name, 33, 91.4);
    doc.text(item?.customer_details.phone_number, 33.3, 99);
    doc.text(item?.customer_details.customer_address, 36.4, 106.5);

    doc.text(item_01, 30, 139.6);
    doc.text(item_01_quantity, 116, 139.6);
    doc.text(item_01_price, 137, 139.6);
    doc.text(item_01_total_price, 168, 139.6);

    doc.text(item_02, 30, 154);
    doc.text(item_02_quantity, 116, 154);
    doc.text(item_02_price, 137, 154);
    doc.text(item_02_total_price, 168, 154);

    doc.text(item_03, 30, 167);
    doc.text(item_03_quantity, 116, 167);
    doc.text(item_03_price, 137, 167);
    doc.text(item_03_total_price, 168, 167);

    doc.text(item_04, 30, 180.8);
    doc.text(item_04_quantity, 116, 180.8);
    doc.text(item_04_price, 137, 180.8);
    doc.text(item_04_total_price, 168, 180.8);

    doc.text(item_05, 30, 194.6);
    doc.text(item_05_quantity, 116, 194.6);
    doc.text(item_05_price, 137, 194.6);
    doc.text(item_05_total_price, 168, 194.6);

    doc.text(item_06, 30, 208.2);
    doc.text(item_06_quantity, 116, 208.2);
    doc.text(item_06_price, 137, 208.2);
    doc.text(item_06_total_price, 168, 208.2);

    doc.text((item?.totalPrice).toString(), 161, 225.5);
    doc.text("Home", 182, 233.8);
    doc.text("120.00/-", 161, 233.8);
    doc.text((item?.discount).toString(), 161, 242.2);
    doc.text(item?.customer_details?.salePrice.toString(), 161, 255.5);
    doc.save(item?.id);
    doc.autoPrint();
    //This is a key for printing
    doc.output("dataurlnewwindow");
  };