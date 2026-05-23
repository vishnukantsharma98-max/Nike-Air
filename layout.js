import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "NIKE AIR — Zero Gravity Footwear",
  description:
    "Experience the future of footwear. Engineered with Nike ZoomX Foam™ and Flyknit Core™ technology for weightless performance that defies gravity.",
  keywords: ["nike", "nike air", "shoes", "zero gravity", "footwear", "futuristic", "sneakers", "zoomx"],
  openGraph: {
    title: "NIKE AIR — Zero Gravity Footwear",
    description: "Experience the future of footwear. Engineered for weightless performance.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
