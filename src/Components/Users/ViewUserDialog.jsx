import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import UserForm from "./UserForm";

const ViewUserDialog = ({ open, user, setOpen, onEdit }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] w-full max-h-[85vh] overflow-y-auto" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription className="sr-only">View user details and information.</DialogDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onEdit} 
            title="Edit User" 
            className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600 hover:text-white p-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <UserForm 
          mode="view" 
          initialData={user} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewUserDialog;