"use client";

// React, Next.js imports
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Custom components
import UserDetails from "@/components/dashboard/forms/user-details";
import CustomModal from "@/components/dashboard/shared/custom-modal";

// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks and utilities
// import { useToast } from "@/components/ui/use-toast";
import { showToast } from "nextjs-toast-notify";
import { useModal } from "@/providers/modal-provider";

// Lucide icons
import { Edit, MoreHorizontal, Trash } from "lucide-react";

// Queries
import { getAllDispatchs } from "@/queries/dispatch";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

// Prisma models
import { Dispatch } from "@/types/dispatch";

export const columns: ColumnDef<Dispatch>[] = [
  // {
  //   accessorKey: "image",
  //   header: "Image",
  //   cell: ({ row }) => {
  //     return (
  //       <div className=" h-20 min-w-20 rounded-xl overflow-hidden">
  //         <Image
  //           src={row.original.picture}
  //           alt=""
  //           width={25}
  //           height={25}
  //           className="w-20 h-20 rounded-full object-cover shadow-2xl"
  //         />
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.name}
        </span>
      );
    },
  },

  {
    accessorKey: "recieverName",
    header: "Recievers Name",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.recieverName}
        </span>
      );
    },
  },

  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return <span>{row.original.phone}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground flex justify-center">
          {row.original.status}
        </span>
      );
    },
  },
  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions rowData={rowData} />;
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  rowData: Dispatch;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  //   const { toast } = useToast();
  const router = useRouter();

  // Return null if rowData or rowData.id don't exist
  if (!rowData || !rowData.id) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                // Custom modal component
                <CustomModal>
                  {/* Store details component */}
                  <UserDetails data={{ ...rowData }} />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getAllDispatchs(rowData?.id),
                  };
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete User
            </DropdownMenuItem>
          </AlertDialogTrigger> */}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the User
            and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteUser(rowData.id);
              toast({
                title: "Deleted User",
                description: "The category has been deleted.",
              });
              setLoading(false);
              router.refresh();
              setClose();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  );
};
