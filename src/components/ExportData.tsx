
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getAllData, getAllAccounts } from "@/utils/dataManager";
import { Download } from "lucide-react";

const ExportData = () => {
  const { toast } = useToast();

  const handleExportData = () => {
    try {
      const allData = getAllData();
      const allAccounts = getAllAccounts();
      
      const exportData = {
        formData: allData,
        accounts: allAccounts,
        exportDate: new Date().toISOString(),
        version: "1.0"
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `business-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: "All data has been downloaded as a JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center text-2xl font-semibold">
          <Download className="h-6 w-6 mr-3 text-blue-600" />
          Export Data
        </CardTitle>
        <CardDescription className="text-base">
          Download all system data as a JSON file for backup or analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-600 mb-2">Export includes:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• All user form submissions</li>
              <li>• Account information</li>
              <li>• Form status settings</li>
              <li>• Export timestamp</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleExportData}
            className="w-full h-12 text-base font-medium rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download JSON Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportData;
