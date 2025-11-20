import ApplySellerMultiForm from "@/components/home/forms/apply-seller/apply-seller";
import MinimalHeader from "@/components/home/layout/minimal-header/header";

export default function SellerApplyPage() {
  return (
    <div className="bg-[#eef4fc] h-screen overflow-y-hidden">
      <MinimalHeader />
      <ApplySellerMultiForm />
    </div>
  );
}
