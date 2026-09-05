import "./globals.css";

export const metadata = {
  title: { default: "Tumerasafar | Travel beyond the itinerary", template: "%s | Tumerasafar" },
  description: "Curated India and international journeys, designed by local travel experts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"><body>{children}</body></html>
  );
}
