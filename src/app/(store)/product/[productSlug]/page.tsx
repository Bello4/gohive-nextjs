import { getProductBySlug } from "@/queries/product";
import { redirect } from "next/navigation";

interface ProductPageProps {
  params: {
    productSlug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.productSlug);

  // If product not found, redirect to homepage
  if (!product) {
    redirect("/");
  }

  // If product has no variants, redirect to homepage
  if (!product.variants || product.variants.length === 0) {
    redirect("/");
  }

  // Redirect to the first variant's page
  redirect(`/product/${product.slug}/${product.variants[0].slug}`);
}
