import Header from "@/components/home/layout/header/header";
import MobileApp from "@/components/home/layout/footer/mobile-nav";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mt-16 px-4">
        <p className="mb-6">Scroll down to see the fixed navbar...</p>
        <div className="h-[2000px] bg-gray-100">Content goes here</div>
      </main>
      <MobileApp />
    </>
  );
}
