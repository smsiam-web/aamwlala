import React, { useEffect, useState } from "react";
import { Tabs } from "@mantine/core";
import { AppTextArea, FormInput, FormRadio } from "../../shared/Form";
import { db } from "@/app/utils/firebase";
import { useSelector } from "react-redux";
import { selectSingleCustomer } from "@/app/redux/slices/singleCustomerSlice";
import { selectWeightDetails } from "@/app/redux/slices/tempWeightDetails";

const OrderDetailsForm = () => {
  const [mango, setMango] = useState(null);
  const [khejurGur, setKhejurGur] = useState(null);
  const [honey, setHoney] = useState(null);
  const [mosla, setMosla] = useState(null);
  const [other, setOthers] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [weightDetails, setweightDetails] = useState(null);

  const getCustomer = useSelector(selectSingleCustomer);
  const getWeightDetails = useSelector(selectWeightDetails);
  useEffect(() => {
    setCustomer(getCustomer);
    setweightDetails(getWeightDetails);
  }, [getCustomer, getWeightDetails]);

  // Get products from firebase database
  useEffect(() => {
    const unSub = db
      .collection("products")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const mango = [];
        const khejur = [];
        const honeys = [];
        const moslagura = [];
        const others = [];
        snap.docs.map((doc) => {
          doc.data().product_details.product_type === "আম" &&
            mango.push({
              ...doc.data().product_details,
            });
          doc.data().product_details.parent_category === "খেজুরের গুড়" &&
            khejur.push({
              ...doc.data().product_details,
            });
          doc.data().product_details.parent_category === "মধু" &&
            honeys.push({
              ...doc.data().product_details,
            });
          doc.data().product_details.parent_category === "মশলা গুঁড়া" &&
            moslagura.push({
              ...doc.data().product_details,
            });
          (doc.data().product_details.parent_category === "সরিষার তেল" ||
            doc.data().product_details.parent_category === "ঘি" ||
            doc.data().product_details.parent_category === "কুমড়া বড়ি") &&
            others.push({
              ...doc.data().product_details,
            });
        });
        setMango(mango);
        setKhejurGur(khejur);
        setHoney(honeys);
        setMosla(moslagura);
        setOthers(others);
      });

    return () => {
      unSub();
    };
  }, []);

  return (
    <div className="max-h-full">
      <div>
        <span>Delivery Type:</span>
        <FormRadio
          type="text"
          name="delivery_type"
          forTrue="Home"
          forFalse="Point"
        />
      </div>
      <div>
        <span>Phone Number</span>
        <FormInput
          type="text"
          max={11}
          name="phone_number"
          placeholder="+880"
        />
      </div>
      <div>
        <span>Name</span>
        <FormInput name="customer_name" placeholder="Name" />
      </div>
      <div>
        <span>Address</span>
        <span className="text-sub-title text-sm block">
          (maximum 300 characters)
        </span>
        <AppTextArea
          name="customer_address"
          placeholder="Ex: H#12, R#04, Sec# 4, Mirpur Dhaka."
        />
      </div>
      <div>
        <Tabs color="violet" defaultValue="mango" variant="pills">
          <Tabs.List>
            <Tabs.Tab value="mango">আম</Tabs.Tab>
            <Tabs.Tab value="khejurGur">খেজুরের গুড়</Tabs.Tab>
            <Tabs.Tab value="honey">মধু</Tabs.Tab>
            <Tabs.Tab value="mosla">মশলা গুঁড়া</Tabs.Tab>
            <Tabs.Tab value="others">অন্যান্য</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="mango" pt="xs">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mango?.map((i) => (
                <div
                  key={i.yup}
                  className="p-2 bg-blue-500 rounded-md col-span-1"
                >
                  <span className="pb-10 text-lg text-white">
                    #{i.product_name}
                  </span>
                  <div className="flex items-center pt-1 sm:pt-2">
                    <div className="w-2/3">
                      <FormInput
                        type="number"
                        name={i.yup}
                        id="mango"
                        item={i}
                        placeholder=""
                      />
                    </div>
                    <span className="text-lg text-white font-bold">x 12kg</span>
                  </div>
                  <div className="bg-slate-100 p-1 text-xs rounded-lg flex  justify-around">
                    <div className="text-xs">
                      <h1 className="text-sm leading-tight font-medium">
                        Sale
                      </h1>
                      <span className="text-sm bg-green-200 font-semibold text-green-700 px-2 rounded-full">
                        {i.sale_price}tk
                      </span>
                    </div>
                    <div className="text-xs">
                      <h1 className="text-sm leading-tight font-medium">
                        Weight
                      </h1>
                      <span className="text-sm bg-green-200 text-green-700 font-semibold px-2 rounded-full">
                        {weightDetails.name === i.yup
                          ? weightDetails.weight
                          : 0}
                        kg
                      </span>
                    </div>
                    <div className="text-xs">
                      <h1 className="text-sm leading-tight font-medium">
                        Total
                      </h1>
                      <span className="text-sm bg-green-200 font-semibold text-green-700 px-2 rounded-full">
                        {weightDetails.name === i.yup ? weightDetails.price : 0}
                        /-
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="khejurGur" pt="xs">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {khejurGur?.map((i) => (
                <div
                  key={i.yup}
                  className="p-2 bg-blue-500 rounded-md col-span-1"
                >
                  <span className="pb-10 text-lg text-white">
                    #{i.child_category}
                  </span>
                  <div className="flex items-center pt-1 sm:pt-2">
                    <div className="w-2/3">
                      <FormInput type="number" name={i.yup} placeholder="" />
                    </div>
                    <span className="text-lg text-white font-bold">.kg</span>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="others" pt="xs">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {other?.map((i) => (
                <div
                  key={i.yup}
                  className="p-2 bg-blue-500 rounded-md col-span-1"
                >
                  <span className="pb-10 text-lg text-white">
                    #{i.child_category}
                  </span>
                  <div className="flex items-center pt-1 sm:pt-2">
                    <div className="w-2/3">
                      <FormInput type="number" name={i.yup} placeholder="" />
                    </div>
                    <span className="text-lg text-white font-bold">.kg</span>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="honey" pt="xs">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {honey?.map((i) => (
                <div
                  key={i.yup}
                  className="p-2 bg-blue-500 rounded-md col-span-1"
                >
                  <span className="pb-10 text-lg text-white">
                    #{i.child_category}
                  </span>
                  <div className="flex items-center pt-1 sm:pt-2">
                    <div className="w-2/3">
                      <FormInput type="number" name={i.yup} placeholder="" />
                    </div>
                    <span className="text-lg text-white font-bold">.kg</span>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="mosla" pt="xs">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {mosla?.map((i) => (
                <div
                  key={i.yup}
                  className="p-2 bg-blue-500 rounded-md col-span-1"
                >
                  <span className="pb-10 text-lg text-white">
                    #{i.child_category}
                  </span>
                  <div className="flex items-center pt-1 sm:pt-2">
                    <div className="w-2/3">
                      <FormInput type="number" name={i.yup} placeholder="" />
                    </div>
                    <span className="text-lg text-white font-bold">.kg</span>
                  </div>
                </div>
              ))}
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
      <div className="mt-3">
        <span>Price</span>
        <FormInput type="number" name="salePrice" placeholder="Price" />
      </div>
      <div>
        <span>Note</span>
        <span className="text-sub-title text-sm block">
          (maximum 500 characters)
        </span>
        <AppTextArea name="note" placeholder="Note..." />
      </div>
    </div>
  );
};

export default OrderDetailsForm;
