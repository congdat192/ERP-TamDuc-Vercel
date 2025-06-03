
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Settings, FileText } from "lucide-react";

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            ERP Management System
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Comprehensive business management platform with advanced features for modern enterprises
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Link to="/customer-management">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 hover:bg-white/20 transition-all duration-300 group">
              <Users className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-3">Customer Management</h3>
              <p className="text-slate-300">
                Manage customer data, track transactions, and analyze customer behavior with advanced filtering and reporting tools.
              </p>
              <Button className="mt-6 w-full">
                Access Customer Module
              </Button>
            </div>
          </Link>

          <Link to="/platform-admin">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 hover:bg-white/20 transition-all duration-300 group">
              <Settings className="w-12 h-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-semibold text-white mb-3">Platform Admin</h3>
              <p className="text-slate-300">
                System administration, tenant management, licensing, and platform monitoring for super administrators.
              </p>
              <Button className="mt-6 w-full">
                Access Admin Panel
              </Button>
            </div>
          </Link>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 hover:bg-white/20 transition-all duration-300 group">
            <FileText className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold text-white mb-3">Documentation</h3>
            <p className="text-slate-300">
              Comprehensive documentation, user guides, and API references for all system features.
            </p>
            <Button className="mt-6 w-full" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-400">
            Built with modern technologies for optimal performance and user experience
          </p>
        </div>
      </div>
    </div>
  );
}

export default Index;
