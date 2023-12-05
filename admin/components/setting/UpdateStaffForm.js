import React, { useState } from "react";
import FileUpload from "@/app/components/shared/FileUpload";
import { FormInput } from "../../components/shared/Form";

const UpdateStaffForm = () => {
  const formInitial = {
    thumbImage: "",
  };
  const [formData, setFormData] = useState(formInitial);
  const dataChangerThumbnail = (value) => {
    setFormData({ ...formData, thumbImage: value });
  };
  return (
    <>
      <label className="lable">
        Brand Logo
      </label>
      <FileUpload
        name="thumbImage"
        dataChanger={(value) => dataChangerThumbnail(value)}
        type="image"
        prev_src={"localhost:8001/" + formData?.thumbImage}
        required
        allowed_extensions={["jpg", "jpeg", "png", "gif"]}
        recommended="Recommenden size: Square / 🔳"
      />
      <div>
        <span className="lable">Company Name</span>
        <FormInput name="company_name" placeholder="Company Name" />
      </div>
      <div>
        <span className="lable">Buisness Email</span>
        <FormInput name="buissnes_email" placeholder="Buisness Email" />
      </div>
      <div>
        <span className="lable">Contact Number</span>
        <FormInput name="company_contact" placeholder="Phone number" />
      </div>
      <div>
        <span className="lable">Address</span>
        <FormInput
          name="address"
          placeholder="Max 25 Char."
        />
      </div>

      <div>
        <span className="lable">Bulk Auth Key</span>
        <FormInput name="bulk_auth" type="password" placeholder="Auth key" items={null} />
      </div>    
      <div>
        <span className="lable">SFC API Key</span>
        <FormInput name="sfc_api_key" type="password" placeholder="SFC API key" items={null} />
      </div>    
      <div>
        <span className="lable">SFC Secret Key</span>
        <FormInput name="sfc_secret_key" type="password" placeholder="SFC Secret key" items={null} />
      </div>    
    </>
  );
};

export default UpdateStaffForm;
