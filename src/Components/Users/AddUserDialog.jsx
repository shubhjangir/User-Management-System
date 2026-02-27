import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import UserForm from "./UserForm";

const AddUserDialog = ({ open, setOpen, onAdd }) => {
  const handleCreateSubmit = (values) => {
    const fullName =
      `${values.firstName} ${values.middleName} ${values.lastName}`
        .replace(/\s+/g, " ")
        .trim();

    const newUser = {
      name: fullName,
      email: values.email,
      mobile: values.mobile,
      address1: values.address1,
      address2: values.address2,
      address3: values.address3,
      pincode: values.pincode,
      photoOriginal: values.photoOriginal,
      photoThumbnail: values.photoThumbnail,
    };

    onAdd(newUser);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new user to the system.
          </DialogDescription>
        </DialogHeader>

        <UserForm
          mode="create"
          onSubmit={handleCreateSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
