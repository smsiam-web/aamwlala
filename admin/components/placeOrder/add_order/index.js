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
import axios from 'axios';

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
  const user = useSelector(selectUser);
  const router = useRouter();
  const [products, setProducts] = useState(null);
  const [uid, setInvoiceID] = useState(null);

  // Get products from firebase database
  useEffect(() => {
    const unSub = db
      .collection("products")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const product = [];
        snap.docs.map((doc) => {
          doc.data().product_details.parent_category === "খেজুরের গুড়" &&
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

  // place product handler on submit
  const placeOrder = async (values) => {
    setLoading(true);
    const order = [];
    let totalPrice = 0;

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

    const discount =
      totalPrice - values.salePrice > 0 ? totalPrice - values?.salePrice : "0";
    // values.salePrice += values.delivery_type ? 120 : 80;
    const invoice_id = Number(uid?.invoice_id) + 1;
    const invoice_str = `RA0${invoice_id}`;
    const cusetomer_id = `RAC0${invoice_id}`;
    const date = Today();

    await placeOrderHandler(
      values,
      discount,
      totalPrice,
      date,
      order,
      invoice_str,
      timestamp
    );
    await createCustomer(values, date, cusetomer_id, timestamp);
    await updateInvoiceID(invoice_id);

    sendConfirmationMsg(values, invoice_str, config);
    setLoading(false);
    router.push("/admin/place-order/id=" + invoice_str);
  };
  

  const sendConfirmationMsg = async (values, invoice_str) => {
    const customer_name = values?.customer_name || "Customer";
    const company_name = config[0]?.values.company_name;   
    const company_contact = config[0]?.values.company_contact;  
   
      const url = "https://api.sms.net.bd/sendsms";
      const apiKey = config[0]?.values.bulk_auth;
      const message = `Dear ${customer_name}, Your order has been successfully placed at ${company_name}. Invoice No: ${invoice_str}. Please keep BDT: ${values?.salePrice}tk ready while receiving the parcel. Hotline: +88${company_contact}. Thanks for being with us.`;
      const to = values?.phone_number; 

      const formData = new FormData();
      formData.append('api_key', apiKey);
      formData.append('msg', message);
      formData.append('to', to);
    
      axios.post(url, formData)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          throw new Error(error);
        });
      
    }
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
    values,
    discount,
    totalPrice,
    date,
    order,
    invoice_str,
    timestamp
  ) => {
    await db.collection("placeOrder").doc(invoice_str).set({
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
