import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2, Save, Smile, Frown, AlertCircle, Zap, Meh,
  FileText, List, Edit, Trash2, X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const moodsList = [
  { key: "happy", label: "Loved it", icon: Smile, color: "text-green-700", bg: "bg-green-100", border: "border-green-300" },
  { key: "sad", label: "Disappointing", icon: AlertCircle, color: "text-red-700", bg: "bg-red-100", border: "border-red-300" },
  { key: "angry", label: "Average", icon: Frown, color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-300" },
  { key: "excited", label: "Fantastic", icon: Zap, color: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-300" },
  { key: "neutral", label: "Neutral", icon: Meh, color: "text-gray-700", bg: "bg-gray-100", border: "border-gray-300" },
];

const TemplateForm = ({ onSave }: { onSave: () => void }) => {
  const [niche, setNiche] = useState("");
  const [reviews, setReviews] = useState<Record<string, string>>({
    happy: "", sad: "", angry: "", excited: "", neutral: "",
  });
  const [loading, setLoading] = useState(false);
  const [showTemplateList, setShowTemplateList] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const { data, error } = await supabase
        .from("review_templates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setTemplates(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load templates");
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setNiche(template.niche || template.name || "");
    const reviewsObj: Record<string, string> = {};
    moodsList.forEach((m) => {
      const arr = template.moods?.[m.key] || [];
      reviewsObj[m.key] = Array.isArray(arr) ? arr.join(", ") : "";
    });
    setReviews(reviewsObj);
    setShowTemplateList(false);
  };

  const handleDelete = async (id: string, nicheName: string) => {
    if (!confirm(`Delete template for "${nicheName}"?`)) return;
    try {
      const { error } = await supabase.from("review_templates").delete().eq("id", id);
      if (error) throw error;
      toast.success("Template deleted");
      fetchTemplates();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleSubmit = async () => {
    if (!niche.trim()) return toast.error("Enter a niche");
    const formattedMoods = Object.fromEntries(
      Object.entries(reviews).map(([k, v]) => [k, v.split(",").map((t) => t.trim()).filter(Boolean)])
    );

    try {
      setLoading(true);
      if (editingTemplate) {
        const { error } = await supabase
          .from("review_templates")
          .update({ niche, moods: formattedMoods, updated_at: new Date().toISOString() })
          .eq("id", editingTemplate.id);
        if (error) throw error;
        toast.success("Template updated");
      } else {
        const { error } = await supabase
          .from("review_templates")
          .insert([{ niche, moods: formattedMoods }]);
        if (error) throw error;
        toast.success("Template added");
      }
      setNiche("");
      setReviews({ happy: "", sad: "", angry: "", excited: "", neutral: "" });
      setEditingTemplate(null);
      onSave();
      fetchTemplates();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNiche("");
    setReviews({ happy: "", sad: "", angry: "", excited: "", neutral: "" });
    setEditingTemplate(null);
  };

  const filledMoods = Object.values(reviews).filter((r) => r.trim()).length;

  return (
    <div className="space-y-6 px-0 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12 ">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl">
        <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {editingTemplate ? "Edit Review Template" : "Add Review Template"}
              </h2>
              <p className="text-blue-100 text-sm mt-1 ">
                Create mood-based review suggestions for your niche
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowTemplateList(!showTemplateList);
              if (!showTemplateList) fetchTemplates();
            }}
            className="bg-white/25 hover:bg-white/40 text-white font-medium backdrop-blur-md"
          >
            <List className="mr-2 h-5 w-5" />
            {showTemplateList ? "Hide Templates" : "View Templates"}
          </Button>
        </div>
      </Card>

      {/* Template List */}
      {showTemplateList && (
        <Card className="bg-white border border-gray-200 shadow-lg">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">All Templates</h3>
              <Button variant="outline" size="sm" onClick={() => setShowTemplateList(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {loadingTemplates ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
              </div>
            ) : templates.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No templates yet.</p>
            ) : (
              <div className="space-y-3">
                {templates.map((t) => {
                  const total = Object.values(t.moods).reduce(
                    (acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0),
                    0
                  );
                  return (
                    <Card
                      key={t.id}
                      className="border border-gray-200 hover:border-blue-400 transition-colors"
                    >
                      <div className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{t.niche}</h4>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {total} reviews
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {moodsList.map((m) => {
                              const count = t.moods[m.key]?.length || 0;
                              if (!count) return null;
                              const Icon = m.icon;
                              return (
                                <span
                                  key={m.key}
                                  className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${m.bg} ${m.color} font-medium`}
                                >
                                  <Icon className="w-3 h-3" /> {m.label}: {count}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(t)}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(t.id, t.niche)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Form */}
      <Card className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl">
        <div className="p-5 sm:p-8 space-y-8">
          {/* Niche */}
          <div className="space-y-3">
            <Label htmlFor="niche" className="font-semibold text-gray-700">
              Business Niche *
            </Label>
            <Input
              id="niche"
              placeholder="e.g., Gym, Salon, Cafe"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="h-12 bg-white border-gray-300 focus:border-blue-500"
            />
          </div>

          {/* Progress */}
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-bold text-blue-700">{filledMoods}/5 moods</span>
            </div>
            <div className="w-full bg-white rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                style={{ width: `${(filledMoods / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Moods */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {moodsList.map((m) => {
              const Icon = m.icon;
              const count = reviews[m.key].split(",").filter((r) => r.trim()).length;
              return (
                <div key={m.key} className={`p-4 rounded-xl border-2 ${m.border} ${m.bg}`}>
                  <Label className="flex items-center justify-between font-semibold text-gray-800 mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${m.color}`} />
                      {m.label}
                    </div>
                    {count > 0 && (
                      <span className={`text-xs ${m.color}`}>{count} review(s)</span>
                    )}
                  </Label>
                  <Textarea
                    value={reviews[m.key]}
                    onChange={(e) =>
                      setReviews((prev) => ({ ...prev, [m.key]: e.target.value }))
                    }
                    placeholder="Comma separated reviews..."
                    className="min-h-[100px] bg-white border-gray-300 focus:border-blue-500 resize-none"
                  />
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleSubmit}
              disabled={loading || !niche.trim()}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {editingTemplate ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {editingTemplate ? "Update Template" : "Save Template"}
                </>
              )}
            </Button>
            {editingTemplate && (
              <Button variant="outline" onClick={handleCancel} className="h-12">
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TemplateForm;
