import '../../styles/global.css';

export const metadata = {
  title: 'Custom Browser',
  description: 'A custom browser built with Electron and Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}
