// src/app/layout.tsx
import Header from '../../components/Header'

// import '../styles/globals.css'; // Adjust the path if necessary

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <main className="p-4">
        {children}
      </main>
    </>
  );
}
