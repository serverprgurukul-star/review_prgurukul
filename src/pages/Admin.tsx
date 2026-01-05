import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Building2, FileText, Menu, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import BusinessForm from "@/components/admin/BusinessForm";
import BusinessTable from "@/components/admin/BusinessTable";
import TemplateForm from "@/components/admin/TemplateForm";
import AuthForm from "@/components/admin/AuthForm";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("business");
  const [showForm, setShowForm] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // 🔹 Get Supabase session
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  // 🔹 Fetch businesses
  const { data: businesses, refetch } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session && activeTab === "business",
  });

  // 🔹 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // 🔹 Sidebar Tabs
  const tabs = [
    { id: "business", label: "Business Management", icon: Building2 },
    { id: "template", label: "Template Management", icon: FileText },
  ];

  // 🔹 Loading state
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 🔹 Auth form if not logged in
  if (!session) return <AuthForm />;

  // ──────────────────────────────
  // ✅ MAIN UI
  // ──────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-14 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <img src="/lo.JPG" alt="logo" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500">Pr.Gurukul</p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.email || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2 border-gray-300 hover:bg-red-50 hover:border-red-500 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white h-auto border-r border-gray-200 shadow-lg lg:shadow-none
            transform transition-transform duration-300 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
            mt-[73px] lg:mt-0
          `}
        >
          <div className="p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-3">
              Navigation
            </p>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sidebar footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-none border-gray-200 bg-white">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <img className="w-44" src="/Logo_3.svg" alt="" />
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-[73px]"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] mx-auto w-full">
          {/* ───── BUSINESS TAB ───── */}
          {activeTab === "business" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Business Management
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Manage your registered businesses and their details
                  </p>
                </div>
                {!showForm && (
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Business
                  </Button>
                )}
              </div>

              {showForm ? (
                <BusinessForm
                  business={editingBusiness}
                  onClose={() => {
                    setShowForm(false);
                    setEditingBusiness(null);
                    refetch();
                  }}
                />
              ) : (
                <BusinessTable
                  businesses={businesses || []}
                  onEdit={(b) => {
                    setEditingBusiness(b);
                    setShowForm(true);
                  }}
                  onRefetch={refetch}
                />
              )}
            </div>
          )}

          {/* ───── TEMPLATE TAB ───── */}
          {activeTab === "template" && (
            <div className="space-y-2 animate-in fade-in duration-300 ">
              {/* <h2 className="text-2xl font-bold text-gray-900">Template Management</h2>
              <p className="text-gray-600 text-sm">
                Create and manage mood-based review templates
              </p> */}
              <TemplateForm onSave={() => toast.success("Template saved!")} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
