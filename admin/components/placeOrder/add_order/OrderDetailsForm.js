import React, { useEffect, useState } from "react";
import { Tabs } from "@mantine/core";
import { AppTextArea, FormInput, FormRadio } from "../../shared/Form";
import { db } from "@/app/utils/firebase";

const OrderDetailsForm = () => {
  const [products, setProducts] = useState(null);

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
        <Tabs color="violet" defaultValue="gallery" variant="pills">
          <Tabs.List>
            <Tabs.Tab value="gallery">খেজুরের গুড়</Tabs.Tab>
            <Tabs.Tab value="messages">আম</Tabs.Tab>
            <Tabs.Tab value="settings">মধু</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gallery" pt="xs">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {products?.map((i) => (
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

          <Tabs.Panel value="messages" pt="xs">
           Development mode
          </Tabs.Panel>

          <Tabs.Panel value="settings" pt="xs">
            Settings tab content
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
