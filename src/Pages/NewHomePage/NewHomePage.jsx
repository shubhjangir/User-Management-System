import React, { useState } from "react";
import { useUsers  } from "../../hooks/useUsers";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ModeToggle } from "../../components/ModeToggle";
import { ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
import ViewUserDialog from "../../Components/Users/ViewUserDialog";
import EditUserDialog from "../../Components/Users/EditUserDialog";
import AddUserDialog from "../../Components/Users/AddUserDialog";

const NewHomePage = () => {
  const navigate = useNavigate();
  // for user view dialog
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  //for add user dialog
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Example pagination limit

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId);
    }
  };

  const filteredUsers = React.useMemo(() => {
    let result = [...users];

    // Search Filtering
    if (activeSearchQuery) {
      const lowerQuery = activeSearchQuery.toLowerCase();
      result = result.filter((user) => {
        const fullAddress =
          `${user.address1 || ""} ${user.address2 || ""} ${user.address3 || ""} ${user.pincode || ""}`.toLowerCase();
        return (
          user.name?.toLowerCase().includes(lowerQuery) ||
          user.email?.toLowerCase().includes(lowerQuery) ||
          user.mobile?.toString().toLowerCase().includes(lowerQuery) ||
          fullAddress.includes(lowerQuery)
        );
      });
    }

    // Sorting
    if (sortConfig.key !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [users, sortConfig, activeSearchQuery]);

  // Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePrevious = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Formik validation will be handled inside EditUserDialog and SignUpPage

  const getAvatarUrl = (user) => {
    if (
      user.photoThumbnail instanceof Blob ||
      user.photoThumbnail instanceof File
    )
      return URL.createObjectURL(user.photoThumbnail);
    if (user.thumbnail instanceof Blob || user.thumbnail instanceof File)
      return URL.createObjectURL(user.thumbnail);
    if (
      user.photoOriginal instanceof Blob ||
      user.photoOriginal instanceof File
    )
      return URL.createObjectURL(user.photoOriginal);
    if (user.photo instanceof Blob || user.photo instanceof File)
      return URL.createObjectURL(user.photo);
    return (
      user.photoThumbnail ||
      user.thumbnail ||
      user.photoOriginal ||
      user.photo ||
      undefined
    );
  };

  return (
    <div className="p-8 min-h-screen bg-background text-foreground shadow-xl ring-gray-900/5 transition-colors duration-300">
      <Card className="w-full shadow-lg">
        {/* Header Section */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-2xl font-bold">User Listing</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search by name, email, mobile, or address..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              onBlur={handleSearch}
              className="w-[300px] "
              style={{ marginBottom: "0px" }}
            />
            <Button className="cursor-pointer" onClick={handleSearch}>Search</Button>
            <Button className="cursor-pointer" onClick={() => setIsAddUserOpen(true)}>Add User</Button>
            <ModeToggle />
          </div>
        </CardHeader>

        <CardContent>
          {/* Table Section */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Sr. No.</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 hover:bg-transparent font-bold"
                      onClick={() => handleSort("name")}
                    >
                      Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 hover:bg-transparent font-bold"
                      onClick={() => handleSort("email")}
                    >
                      Email <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="p-0 hover:bg-transparent font-bold"
                      onClick={() => handleSort("mobile")}
                    >
                      Mobile <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayUsers.map((user, index) => (
                  <TableRow key={user.id || index}>
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={user.address1 + ", " + user.address3}
                    >
                      {user.address1}, {user.address3}
                    </TableCell>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={getAvatarUrl(user)} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          title="View"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsViewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Edit"
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          onClick={() => handleDelete(user.id)}
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Section */}
          <div className="mt-6 flex items-center justify-between">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={handlePrevious}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* Show Page 1 */}
                {currentPage > 2 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Ellipsis if needed */}
                {currentPage > 3 && (
                  <PaginationItem>
                    <span className="flex h-9 w-9 items-center justify-center">
                      ...
                    </span>
                  </PaginationItem>
                )}

                {/* Previous Page Link if not on page 1 */}
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Current Page */}
                <PaginationItem>
                  <PaginationLink
                    isActive
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>

                {/* Next Page Link if not last page */}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {/* Ellipsis if needed */}
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <span className="flex h-9 w-9 items-center justify-center">
                      ...
                    </span>
                  </PaginationItem>
                )}

                {/* Last Page */}
                {currentPage < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={handleNext}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="text-sm text-muted-foreground w-20 text-right">
              Page {currentPage} of {totalPages}
            </div>
          </div>
          <ViewUserDialog
            open={isViewOpen}
            setOpen={setIsViewOpen}
            user={selectedUser}
            onEdit={() => {
              setIsViewOpen(false);
              setTimeout(() => setIsEditOpen(true), 100); // Small delay for smooth transition
            }}
          />
          <EditUserDialog
            open={isEditOpen}
            setOpen={setIsEditOpen}
            user={selectedUser}
            onSave={updateUser}
          />
          <AddUserDialog 
            open={isAddUserOpen} 
            setOpen={setIsAddUserOpen} 
            onAdd={addUser} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewHomePage;
