import React from "react";
import {Dialog , DialogContent , DialogHeader , DialogTitle , DialogFooter} from "../ui/dialog";
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import { Avatar , AvatarImage , AvatarFallback } from "../ui/avatar";

import { Edit } from "lucide-react";

const ViewUserDialog = ({open , user , setOpen, onEdit}) => {
  if(!user)
    return null;

  return (
    <Dialog open = {open} onOpenChange = {setOpen}>
      <DialogContent className = "sm:max-w-[500px]" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>User Details</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onEdit} title="Edit User" className = "cursor-pointer bg-blue-500 text-white hover:bg-blue-600 hover:text-white p-2">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className = "grid gap-4 py-4">
          {/* Name */ }
          <div className = "grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <div className = "border rounded-md p-2 bg-background dark:bg-secondary text-foreground">
              {user.name}
            </div>
          </div>
          {/*Email*/}
          <div className = "grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <div className = "border rounded-md p-2 bg-background dark:bg-secondary text-foreground">
              {user.email}
            </div>
          </div>
          {/*Mobile*/}
          <div className = "grid gap-2">
            <label className="text-sm font-medium">Mobile</label>
            <div className = "border rounded-md p-2 bg-background dark:bg-secondary text-foreground">
              {user.mobile}
            </div>
          </div>
          {/*Address*/}
          <div className = "grid gap-2">
            <label className="text-sm font-medium">Address</label>
            <div className = "border rounded-md p-2 bg-background dark:bg-secondary text-foreground min-h-[60px]">
              <p>{user.address1}</p>
              {user.address2 && <p>{user.address2}</p>}
              <p>{user.address3}</p>
              <p>{user.pincode}</p>
            </div>
          </div>
          {/*Thumbnail*/}
          <div className = "grid gap-2">
            <label className="text-sm font-medium">Thumbnail</label>
            <Avatar className="h-24 w-24">
              <AvatarImage src = {user.photo || user.thumbnail} alt = {user.name} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>  
        </div>
        <DialogFooter>
          <Button onClick = {() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewUserDialog;