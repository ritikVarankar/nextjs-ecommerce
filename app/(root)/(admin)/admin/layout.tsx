import AppSidebar from "@/components/application/Admin/AppSidebar";
import ThemeProvider from "@/components/application/Admin/ThemeProvider";
import TopBar from "@/components/application/Admin/TopBar";
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />

        <main className="md:w-[calc(100vw-16rem)] w-full">
          <div className="pt-[70px] md:px-8 px-5 min-h-[calc(100vh-40px)] pb-10">
            <TopBar />
            {children}
          </div>
          <div className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
            © 2025 Developer Ritik™. All Rights Reserved.
          </div>
        </main>

      </SidebarProvider>
    </ThemeProvider>
  );
}
