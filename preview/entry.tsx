import { createRoot } from "react-dom/client";
import { useEffect, useState, Suspense } from "react";
import { useLoc } from "./shims/router";
import { NotFoundError } from "./shims/navigation";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import HomePage from "@/app/page";
import ShopPage from "@/app/shop/page";
import ProductPage from "@/app/shop/[slug]/page";
import CartPage from "@/app/cart/page";
import CheckoutPage from "@/app/checkout/page";
import ServicesPage from "@/app/services/page";
import BookPage from "@/app/book/page";
import PortfolioPage from "@/app/portfolio/page";
import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import PoliciesPage from "@/app/policies/page";
import NotFound from "@/app/not-found";

const routes: Record<string, (p: any) => any> = {
  "/": HomePage, "/shop": ShopPage, "/cart": CartPage, "/checkout": CheckoutPage, "/services": ServicesPage,
  "/book": BookPage, "/portfolio": PortfolioPage, "/about": AboutPage, "/contact": ContactPage, "/policies": PoliciesPage,
};

function Route() {
  const { path } = useLoc();
  const [el, setEl] = useState<React.ReactNode>(null);
  useEffect(() => {
    let live = true;
    const m = path.match(/^\/shop\/([^/]+)$/);
    const Page = m ? ProductPage : routes[path];
    if (!Page) { setEl(<NotFound />); return; }
    // Server components are async functions in the real app; resolve them client-side here.
    const isClientPage = Page === CartPage || Page === CheckoutPage; // hook-based pages render as elements
    Promise.resolve()
      .then(() => (isClientPage ? <Page /> : m ? Page({ params: Promise.resolve({ slug: m[1] }) }) : Page({})))
      .then((node) => live && setEl(node))
      .catch((e) => live && setEl(e instanceof NotFoundError ? <NotFound /> : <p className="container-x py-20">This page didn&apos;t load.</p>));
    return () => { live = false; };
  }, [path]);
  return <Suspense fallback={null}>{el}</Suspense>;
}

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <Header />
    <main id="main"><Route /></main>
    <Footer />
    <CartDrawer />
    <WhatsAppFab />
  </CartProvider>,
);
