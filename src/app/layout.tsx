import './globals.css';

export const metadata = {
  title: 'Spreadsheet App',
  description: 'A spreadsheet application built with Next.js',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
};

export default RootLayout;
