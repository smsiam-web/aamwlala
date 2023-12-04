import React, {useEffect} from "react";
import AdminLayout from "@/admin/AdminLayout";
import DashBoard from "@/admin/components/dashboard";
import { useDispatch } from "react-redux";
import { db } from "@/app/utils/firebase";
import { updateConfig } from "@/app/redux/slices/configSlice";
import { updateOrder } from "@/app/redux/slices/orderSlice";

const AdmainMain = () => {

  const dispatch = useDispatch();

    //get config
    useEffect(() => {
      const unSub = db.collection("config").onSnapshot((snap) => {
        const configData = [];
        snap.docs.map((doc) => {
          configData.push(
            doc.data()
          )
        });
        dispatch(updateConfig(configData));
      });
      return () => {
        unSub();
      };
    }, []);

  //     // Get order from firebase database
  // useEffect(() => {
  //   const unSub = db
  //     .collection("placeOrder")
  //     .orderBy("timestamp", "desc")
  //     .onSnapshot((snap) => {
  //       const order = [];
  //       snap.docs.map((doc) => {
  //         order.push({
  //           id: doc.id,
  //           ...doc.data(),
  //           // timestamp: doc.data().timestamp?.toDate().getTime(),
  //         });
  //       });
  //       dispatch(updateOrder(order));
  //     });
  //   return () => {
  //     unSub();
  //   };
  // }, []);

  return (
    <AdminLayout>
      <DashBoard />
    </AdminLayout>
  );
};

export default AdmainMain;
