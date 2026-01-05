import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  Save,
  Upload,
  X,
  Building2,
  Link2,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

interface BusinessFormProps {
  business?: any;
  onClose: () => void;
}

const BusinessForm = ({ business, onClose }: BusinessFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingMood, setUploadingMood] = useState<number | null>(null);
  const [niche, setniche] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    businessName: business?.business_name || "",
    logoUrl: business?.logo_url || "",
    niche: business?.niche || "",
    googleReviewUrl: business?.google_review_url || "",
    moodImages: business?.mood_images || ["", "", "", "", ""],
    moodCount: business?.mood_count || 5,
  });

  // Utility to generate slug
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Load niche from Supabase
  useEffect(() => {
    const fetchniche = async () => {
      const { data, error } = await supabase
        .from("review_templates")
        .select("niche")
        .order("niche", { ascending: true });

      if (error) {
        toast.error("Failed to load niche: " + error.message);
      } else {
        // Extract unique niche names
        const uniqueniche = [...new Set(data.map((item) => item.niche))];
        setniche(uniqueniche);
      }
    };

    fetchniche();
  }, []);

  // Upload file to Supabase storage and return public URL
  const uploadToSupabase = async (file: File, folder: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("business-assets")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("business-assets")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleLogoUpload = async (file: File) => {
    try {
      setUploadingLogo(true);
      const url = await uploadToSupabase(file, "logos");
      setFormData({ ...formData, logoUrl: url });
      toast.success("Logo uploaded successfully!");
    } catch (err: any) {
      toast.error("Logo upload failed: " + err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleMoodUpload = async (file: File, index: number) => {
    try {
      setUploadingMood(index);
      const url = await uploadToSupabase(file, "mood-images");
      const updated = [...formData.moodImages];
      updated[index] = url;
      setFormData({ ...formData, moodImages: updated });
      toast.success(`Mood image ${index + 1} uploaded!`);
    } catch (err: any) {
      toast.error("Mood image upload failed: " + err.message);
    } finally {
      setUploadingMood(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = generateSlug(formData.businessName);
      const businessData = {
        business_name: formData.businessName,
        slug,
        logo_url: formData.logoUrl,
        niche: formData.niche,
        google_review_url: formData.googleReviewUrl,
        mood_images: formData.moodImages.filter((url) => url.trim() !== ""),
        mood_count: formData.moodCount,
      };

      if (business) {
        const { error } = await supabase
          .from("businesses")
          .update(businessData)
          .eq("id", business.id);
        if (error) throw error;
        toast.success("Business updated successfully!");
      } else {
        const { error } = await supabase
          .from("businesses")
          .insert([businessData]);
        if (error) throw error;
        toast.success(
          `Business created! URL: ${window.location.origin}/${slug}`
        );
      }

      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50  px-4">
      <div className="max-w-7xl mx-auto ">
        {/* Responsive Two-Column Layout */}
        <Card className=" backdrop-blur-xl border-gray-200 shadow-xl">
          {/* <div className="p-8 grid lg:grid-cols-2 gap-10"> */}
             <div className="p-8  gap-10">
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              {/* Business Name */}
              <div className="space-y-3">
                <Label
                  htmlFor="businessName"
                  className="text-gray-700 font-semibold text-base flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  required
                  placeholder="Enter your business name"
                  className="h-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Public URL:{" "}
                    <span className="font-mono text-blue-600">
                      /{generateSlug(formData.businessName) || "business-name"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold text-base flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Business Logo
                </Label>

                <label className="relative group cursor-pointer">
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 overflow-hidden">
                    {uploadingLogo ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
                        <span className="text-sm text-gray-600">
                          Uploading...
                        </span>
                      </div>
                    ) : formData.logoUrl ? (
                      <div className="relative w-full h-full p-2">
                        <img
                          src={formData.logoUrl}
                          alt="Logo"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-xl flex items-center justify-center">
                          <Upload className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="text-gray-400 h-8 w-8 group-hover:text-blue-600 transition-colors" />
                        <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                          Click to upload logo
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                  />
                </label>
              </div>

              {/* Niche Dropdown */}
              <div className="space-y-3">
                <Label
                  htmlFor="niche"
                  className="text-gray-700 font-semibold text-base flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Business Niche *
                </Label>
                <Select
                  value={formData.niche}
                  onValueChange={(value) =>
                    setFormData({ ...formData, niche: value })
                  }
                  required
                >
                  <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your business category" />
                  </SelectTrigger>
                  <SelectContent>
                    {niche.length > 0 ? (
                      niche.map((nicheItem) => (
                        <SelectItem key={nicheItem} value={nicheItem}>
                          {nicheItem.charAt(0).toUpperCase() +
                            nicheItem.slice(1)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        Loading categories...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Google Review URL */}
              <div className="space-y-3">
                <Label
                  htmlFor="googleReviewUrl"
                  className="text-gray-700 font-semibold text-base flex items-center gap-2"
                >
                  <Link2 className="w-4 h-4 text-blue-600" />
                  Google Review URL *
                </Label>
                <Input
                  id="googleReviewUrl"
                  type="url"
                  value={formData.googleReviewUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      googleReviewUrl: e.target.value,
                    })
                  }
                  required
                  placeholder="https://g.page/your-business/review"
                  className="h-12 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Mood Images */}
            {/* <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-gray-700 font-semibold text-base">
                  Number of Moods *
                </Label>
                <Select
                  value={String(formData.moodCount)}
                  onValueChange={(v) => {
                    const count = Number(v);

                    let updatedImages = [...formData.moodImages].slice(
                      0,
                      count
                    );
                    while (updatedImages.length < count) updatedImages.push("");

                    setFormData({
                      ...formData,
                      moodCount: count,
                      moodImages: updatedImages,
                    });
                  }}
                >
                  <SelectTrigger className="h-12 bg-white border-gray-300">
                    <SelectValue placeholder="Select count" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Label className="text-gray-700 font-semibold text-base flex items-center gap-2 mb-2">
                🎨 Mood Images
              </Label>
              <p className="text-sm text-gray-600 mb-4">
                Upload up to 5 vibrant images showcasing your brand vibe
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.moodImages
                  .slice(0, formData.moodCount)
                  .map((url, index) => (
                    <div
                      key={index}
                      className="relative bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-2 group shadow hover:shadow-lg transition-all"
                    >
                      <label className="cursor-pointer block">
                        <div className="aspect-square flex flex-col items-center justify-center bg-white/70 border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 transition">
                          {uploadingMood === index ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 className="animate-spin text-blue-600 h-6 w-6" />
                              <span className="text-xs text-gray-600">
                                Uploading...
                              </span>
                            </div>
                          ) : url ? (
                            <>
                              <img
                                src={url}
                                alt={`Mood ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition">
                                <Upload className="text-white opacity-0 group-hover:opacity-100 h-6 w-6" />
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition" />
                              <span className="text-xs text-gray-500">
                                Image {index + 1}
                              </span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMoodUpload(file, index);
                          }}
                        />
                      </label>
                      {url && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...formData.moodImages];
                            updated[index] = "";
                            setFormData({ ...formData, moodImages: updated });
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div> */}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 px-8 pb-8 border-t border-gray-200">
            <Button
              onClick={handleSubmit}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {business ? "Update Business" : "Create Business"}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="h-12 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </Card>

        {/* Footer */}
      </div>
    </div>
  );
};

export default BusinessForm;
