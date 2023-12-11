import React, { useEffect, useState } from "react";
import OrderDetailsForm from "./OrderDetailsForm";
import * as Yup from "yup";
import { AppForm, FormBtn } from "../../shared/Form";
import FormHeader from "../../shared/FormHeader";
import { db, timestamp } from "@/app/utils/firebase";
import Button from "../../shared/Button";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectUser } from "@/app/redux/slices/authSlice";
import { Today } from "@/admin/utils/helpers";
import { selectConfig } from "@/app/redux/slices/configSlice";
import axios from "axios";

const validationSchema = Yup.object().shape({
  delivery_type: Yup.boolean().required().label("Delivery type"),
  phone_number: Yup.string()
    .matches(/^[0-9]{11}$/, "Must be exactly 11 digits")
    .required()
    .label("Phone number"),
  customer_name: Yup.string().max(50).required().label("Name"),
  customer_address: Yup.string().max(300).required().label("Address"),
  salePrice: Yup.number().required().label("Sale Price"),
  note: Yup.string().max(500).label("Note"),
  patali_gol: Yup.number().positive().label("Weight"),
  patali_pata: Yup.number().positive().label("Weight"),
  patali_foial: Yup.number().positive().label("Weight"),
  patali_narkel: Yup.number().positive().label("Weight"),
  liquid: Yup.number().positive().label("Weight"),
  dana: Yup.number().positive().label("Weight"),
});

const AddOrder = ({ onClick }) => {
  const [config, setConfig] = useState(useSelector(selectConfig) || null);
  const [loading, setLoading] = useState(false);
  const [orderResponse, setOrderResponse] = useState(false);
  const user = useSelector(selectUser);
  const router = useRouter();
  const [products, setProducts] = useState(null);
  const [uid, setInvoiceID] = useState(null);
  const [isFalse, setFalse] = useState(false);

  // // Function to place an order
  // const placeOrderStf = async (orderData) => {
  //   try {
  //     // Set your API key and secret key
  //     const apiKey = config[0]?.values.sfc_api_key;
  //     const secretKey = config[0]?.values.sfc_secret_key;

  //     // Prepare headers for the request
  //     const headers = new Headers();
  //     headers.append("Api-Key", apiKey);
  //     headers.append("Secret-Key", secretKey);
  //     headers.append("Content-Type", "application/json");

  //     // Make the POST request
  //     const response = await fetch('https://portal.steadfast.com.bd/api/v1/create_order', {
  //       method: 'POST',
  //       headers: headers,
  //       body: JSON.stringify(orderData),
  //     });

  //     // Handle the response
  //     const data = await response.json();
  //     return(data);

  //     // You can update the state or perform other actions based on the response
  //     // For example, if using React with state:
  //     // setOrderResponse(data);
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //   }
  // };

  // Get products from firebase database
  useEffect(() => {
    const unSub = db.collection("orderID").onSnapshot((snap) => {
      snap.docs.map((doc) => {
        setInvoiceID(doc.data());
      });
    });

    return () => {
      unSub();
    };
  }, []);

  // Get products from firebase database
  useEffect(() => {
    const unSub = db
      .collection("products")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const product = [];
        snap.docs.map((doc) => {
          // doc.data().product_details.parent_category === "খেজুরের গুড়" &&
          product.push({
            ...doc.data().product_details,
          });
        });
        setProducts(product);
      });

    return () => {
      unSub();
    };
  }, []);

  // place product handler on submit
  const placeOrder = async (values) => {
    setLoading(true);
    const invoice_id = Number(uid?.invoice_id) + 1;
    const invoice_str = `RA0${invoice_id}`;
    const cusetomer_id = `RAC0${invoice_id}`;
    await updateInvoiceID(invoice_id);

    const order = [];
    let totalPrice = 0;
    let weight = 0;

    products &&
      products.map((item) => {
        const yup = item.yup;

        if (values[yup]) {
          const title = item.yup.split("_");
          let s = [];

          title &&
            title.map((e) => {
              s.push(e[0].toUpperCase() + e.slice(1));
            });

          weight += values[yup];

          order.push({
            title: s.join(" "),
            quantity: values[yup],
            price: item.sale_price,
            total_price: values[yup] * item.sale_price,
          });
        }
      });

    order &&
      order.map((p) => {
        totalPrice += p.total_price;
      });

    const deliveryCrg =
      weight >= 1 && weight === 1 ? 130 : 130 + (weight - 1) * 20;
    const discount =
      totalPrice + deliveryCrg - values.salePrice > 0
        ? totalPrice + deliveryCrg - values?.salePrice
        : "0";

    const date = Today();

    try {
      // Set your API key and secret key
      const apiKey = config[0]?.values.sfc_api_key;
      const secretKey = config[0]?.values.sfc_secret_key;

      // Prepare headers for the request
      const headers = new Headers();
      headers.append("Api-Key", apiKey);
      headers.append("Secret-Key", secretKey);
      headers.append("Content-Type", "application/json");

      const orderData = {
        cod_amount: `${values.salePrice}`,
        invoice: `${invoice_str}`,
        note: `${values.note}`,
        recipient_address: `${values.customer_address}`,
        recipient_name: `${values.customer_name}`,
        recipient_phone: `${values.phone_number}`,
      };

      // Make the POST request
      const response = await fetch(
        "https://portal.steadfast.com.bd/api/v1/create_order",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(orderData),
        }
      );

      // Handle the response
      const data = await response.json();
      console.log(data);
      await placeOrderHandler(
        data,
        deliveryCrg,
        weight,
        values,
        discount,
        totalPrice,
        date,
        order,
        invoice_str,
        timestamp
      );
      await sendConfirmationMsg(
        values,
        invoice_str,
        data?.consignment.tracking_code,
      );

      // You can update the state or perform other actions based on the response
      // For example, if using React with state:
    } catch (error) {

     await isFailedPlaceOrderHandler(
        deliveryCrg,
        weight,
        values,
        discount,
        totalPrice,
        date,
        order,
        invoice_str,
        timestamp
      );
      await sendConfirmationMsg(values, invoice_str);

      console.error("Error placing order:", error);
    }

    await createCustomer(values, date, cusetomer_id, timestamp);

    router.push("/admin/place-order/id=" + invoice_str);
    setLoading(false);
    setOrderResponse(null);
  };

  const sendConfirmationMsg = async (
    values,
    invoice_str,
    tracking_code = ""
  ) => {
    const customer_name = values?.customer_name || "Customer";
    const company_name = config[0]?.values.company_name;
    const company_contact = config[0]?.values.company_contact;

    const url = "https://api.sms.net.bd/sendsms";
    const apiKey = config[0]?.values.bulk_auth;
    const message = `Dear ${customer_name}, Your order has been successfully placed at ${company_name}. Invoice No: ${invoice_str}. Please keep BDT: ${
      values?.salePrice
    }tk ready while receiving the parcel.${
      tracking_code &&
      ` Track your Parcel here: https://steadfast.com.bd/t/${tracking_code}`
    } Hotline: +88${company_contact}. Thanks for being with us.`;
    const to = values?.phone_number;

    const formData = new FormData();
    formData.append("api_key", apiKey);
    formData.append("msg", message);
    formData.append("to", to);

    axios
      .post(url, formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
  // create Customer on firebase database
  const createCustomer = async (values, date, cusetomer_id, timestamp) => {
    await db.collection("createCustomer").doc(values.phone_number).set({
      cus_name: values.customer_name,
      cus_contact: values.phone_number,
      cus_address: values.customer_address,
      date,
      cusetomer_id,
      timestamp,
    });
  };

  // save order details on firebase database
  const placeOrderHandler = async (
    data,
    deliveryCrg,
    weight,
    values,
    discount,
    totalPrice,
    date,
    order,
    invoice_str,
    timestamp
  ) => {
    await db.collection("placeOrder").doc(invoice_str).set({
      consignment_id: data?.consignment.consignment_id,
      tracking_code: data?.consignment.tracking_code,
      deliveryCrg,
      weight,
      customer_details: values,
      discount,
      totalPrice,
      date,
      order,
      timestamp,
      placeBy: user.name,
      placeById: user.staff_id,
      status: "Pending",
    });
  };

  const isFailedPlaceOrderHandler = async (
    deliveryCrg,
    weight,
    values,
    discount,
    totalPrice,
    date,
    order,
    invoice_str,
    timestamp
  ) => {
    await db.collection("placeOrder").doc(invoice_str).set({
      deliveryCrg,
      weight,
      customer_details: values,
      discount,
      totalPrice,
      date,
      order,
      timestamp,
      placeBy: user.name,
      placeById: user.staff_id,
      status: "Pending",
    });
  };

  const updateInvoiceID = async (invoice_id) => {
    await db
      .collection("orderID")
      .doc("LiJLS9p0IzqIB18zPTJm")
      .set({ invoice_id });
  };

  return (
    <main>
      <div>
        <AppForm
          initialValues={{
            delivery_type: true || "",
            phone_number: "",
            customer_name: "",
            customer_address: "",
            salePrice: "",
            note: "",
            patali_gol: "",
            patali_pata: "",
            patali_foial: "",
            patali_narkel: "",
            liquid: "",
            dana: "",
          }}
          onSubmit={placeOrder}
          validationSchema={validationSchema}
        >
          <div className="h-screen relative">
            <div className="w-full">
              <FormHeader
                onClick={onClick}
                title={"Place Order"}
                sub_title="Add your product and necessary information from here."
              />
            </div>

            <div className="w-full h-[75%] md:h-[80%] overflow-y-scroll py-3 px-6 md:px-4 mb-4">
              <OrderDetailsForm />
            </div>

            <div className="fixed bottom-0 right-0 w-full bg-gray-50">
              <div className="py-5 px-6 md:px-4 max-h-full grid grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Button
                    onClick={onClick}
                    title="Cancel"
                    className="bg-red-100 hover:bg-red-200 hover:shadow-lg text-red-600 transition-all duration-300 w-full"
                  />
                </div>
                <div className="col-span-2">
                  <FormBtn
                    loading={loading}
                    onClick={placeOrder}
                    title="Submit"
                    className="bg-blue-400 hover:bg-blue-500 hover:shadow-lg text-white transition-all duration-300 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </AppForm>
      </div>
    </main>
  );
};

export default AddOrder;
