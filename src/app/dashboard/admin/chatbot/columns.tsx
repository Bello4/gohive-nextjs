"use client";

// React, Next.js imports
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Custom components
import ChatbotDetails from "@/components/dashboard/forms/chatbot-details";
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
import { useModal } from "@/providers/modal-provider";

// Lucide icons
import {
  CopyPlus,
  BadgeMinus,
  Edit,
  MoreHorizontal,
  Trash,
  Eye,
} from "lucide-react";

// Queries
import { deleteChatbot, getChatbot } from "@/queries/chatbot";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

// Prisma models
import { Chatbot } from "@/types/chatbot";

export const columns: ColumnDef<Chatbot>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <div className="relative h-30  rounded-xl overflow-hidden">
          <Image
            src={row.original.image}
            alt=""
            width={1000}
            height={1000}
            className="w-25 h-25 rounded-full object-cover shadow-2xl"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Chatbot Name",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.name}
        </span>
      );
    },
  },

  {
    accessorKey: "Link",
    header: "Train CHatbot",
    cell: ({ row }) => {
      return (
        <Link href={`/dashboard/admin/chatbot/${row.original.id}`}>
          <Edit className="hover:text-blue-200" />
        </Link>
      );
    },
  },

  {
    accessorKey: "Session",
    header: "View Bot Sessions",
    cell: ({ row }) => {
      return (
        <Link href={`/dashboard/admin/review-sessions/${row.original.id}`}>
          <Eye className="hover:text-blue-200" />
          <p className="font-extrabold text-lg capitalize">
            {row.original?.chatsession?.length} session
          </p>
        </Link>
        // <Link href={`/dashboard/admin/chatbot/${row.original.id}`}>
        //   <Eye className="hover:text-blue-200" />
        // </Link>
        // <p>{row.original.chatsession.length}</p>
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
  rowData: Chatbot;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const da = getChatbot(rowData?.id);
  console.log(da);
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
                  <ChatbotDetails data={{ ...rowData }} />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getChatbot(rowData?.id),
                  };
                },
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete category
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            category and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deleteChatbot(rowData.id);
              //   toast({
              //     title: "Deleted category",
              //     description: "The category has been deleted.",
              //   });
              setLoading(false);
              router.refresh();
              setClose();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
