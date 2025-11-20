import StoreStatusTag from "@/components/shared/store-status";
// import { useToast } from "@/components/ui/use-toast";
import { showToast } from "nextjs-toast-notify";
import { StoreStatus } from "@/types/store";
import { updateOrderGroupStatus } from "@/queries/order";
import { updateStoreStatus } from "@/queries/store";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface Props {
  storeId: number;
  status: StoreStatus;
}

const StoreStatusSelect: FC<Props> = ({ status, storeId }) => {
  const [newStatus, setNewStatus] = useState<StoreStatus>(status);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();

  // const { toast } = useToast();

  // Options
  const options = Object.values(StoreStatus).filter((s) => s !== newStatus);

  // Handle click

  // Handle click with separate parameters
  const handleClick = async (selectedStatus: StoreStatus) => {
    try {
      console.log(storeId, selectedStatus);
      const response = await updateStoreStatus({
        id: storeId,
        status: selectedStatus,
      });

      showToast.success(response.message, {
        duration: 3000,
        progress: false,
        position: "bottom-right",
        transition: "bounceIn",
        icon: "",
        sound: false,
      });

      if (response.store) {
        setNewStatus(response.store.status as StoreStatus);
        setIsOpen(false);
      }
    } catch (error: any) {
      showToast.error(
        error.response?.data?.message || "Failed to update store status",
        {
          duration: 3000,
          progress: false,
          position: "bottom-right",
          transition: "bounceIn",
          icon: "",
          sound: false,
        }
      );
    }
  };
  return (
    <div className="relative">
      {/* Current status */}
      <div
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <StoreStatusTag status={newStatus} />
      </div>
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-md shadow-md mt-2 w-[140px]">
          {options.map((option) => (
            <button
              key={option}
              className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => handleClick(option)}
            >
              <StoreStatusTag status={option} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreStatusSelect;
