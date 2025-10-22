import { redirect } from "next/navigation";
import { handleProductPage } from "@/queries/product";

interface ProductPageProps {
  params: { productSlug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const result = await handleProductPage(params.productSlug);

    // Redirect based on API response
    redirect(result.redirect);
  } catch (error) {
    // Fallback redirect if API fails
    console.error("Error handling product page:", error);
    redirect("/");
  }
}
