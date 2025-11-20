"use client";

// React, Next.js imports
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

// Custom components
// import UserDetails from "@/components/dashboard/forms/user-details";
import DispatchDetails from "@/components/dashboard/forms/dispatch-details";

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

// Lucide icons
import {
  BadgeCheck,
  BadgeMinus,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";

// Hooks and utilities
// import { useToast } from "@/components/ui/use-toast";
import { showToast } from "nextjs-toast-notify";
import { useModal } from "@/providers/modal-provider";

// Queries
import { getAllDispatchs } from "@/queries/dispatch";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

// Prisma models
import { Dispatch } from "@/types/dispatch";
import { OrderDetails } from "@/types/logistic";

export const columns = (drivers: User[] = []): ColumnDef<OrderDetails>[] => [
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
    accessorKey: "ordernumber",
    header: "Order No",
    cell: ({ row }) => {
      return <span className=" capitalize">{row.original.orderNumber}</span>;
    },
  },

  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      return (
        <span className=" capitalize">{row.original.status.readable}</span>
      );
    },
  },

  {
    accessorKey: "payment",
    header: "Payment Status",
    cell: ({ row }) => {
      return <span>{row.original.payment.method}</span>;
    },
  },
  {
    accessorKey: "",
    header: "Payment",
    cell: ({ row }) => {
      return (
        <span className="flex ">
          {row.original.payment.status}
          {row.original.payment.status == "paid" ? (
            <BadgeCheck className="stroke-green-300" />
          ) : (
            <BadgeMinus />
          )}
        </span>
      );
    },
  },
  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions rowData={rowData} drivers={drivers} />;
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  rowData: Dispatch;
  drivers?: User[]; // Add drivers prop
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ rowData, drivers }) => {
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
                  <DispatchDetails drivers={drivers} data={{ ...rowData }} />
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
