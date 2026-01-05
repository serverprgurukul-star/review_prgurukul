import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2, Star, ArrowLeft } from "lucide-react";
// 💡 Added useEffect for initial review generation
import { useState, useEffect } from "react";
import { toast } from "sonner";

const MOOD_LABELS = ["Sad", "Angry", "Neutral", "Happy", "Excited"];
const MOOD_KEYS = ["sad", "angry", "neutral", "happy", "excited"];

const ReviewReady = () => {
  const { slug, mood } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  // 💡 State to hold the currently displayed review text
  const [reviewContent, setReviewContent] = useState(null);

  // --- Mood Level Calculation ---
  let moodLevel = 3; // default = neutral
  if (mood) {
    if (!isNaN(mood)) {
      // URL param like /review/slug/4
      moodLevel = parseInt(mood);
    } else {
      // URL param like /review/slug/happy
      const moodIndex = MOOD_KEYS.indexOf(mood.toLowerCase());
      moodLevel = moodIndex !== -1 ? moodIndex + 1 : 3;
    }
  }
  // console.log(moodLevel); // Kept the console log for context

  // ✅ Fetch business details
  const { data: business, isLoading: isBusinessLoading } = useQuery({
    queryKey: ["business", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // ✅ Fetch reviews dynamically from Supabase (review_templates)
  const { data: reviewTemplate, isLoading: isReviewLoading } = useQuery({
    queryKey: ["review_templates", business?.niche],
    enabled: !!business?.niche, // run only when business.niche is available
    queryFn: async () => {
      const { data, error } = await supabase
        .from("review_templates")
        .select("moods")
        .eq("niche", business.niche)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // ✅ Get a random review based on mood level (helper function)
  const getReviewFromTemplate = () => {
    if (!reviewTemplate?.moods) return null;
    const moodKey = MOOD_KEYS[moodLevel - 1];
    const reviews = reviewTemplate.moods[moodKey] || [];
    if (reviews.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * reviews.length);
    return reviews[randomIndex];
  };

  // 💡 New function to generate and set the review content
  const generateReview = () => {
    const newReview = getReviewFromTemplate();
    setReviewContent(newReview);
  };

  // 💡 useEffect to generate the initial review once data is loaded
  useEffect(() => {
    if (reviewTemplate && !reviewContent) {
      generateReview();
    }
  }, [reviewTemplate]); // Re-run when reviewTemplate loads/changes

  // --- The rest of your existing logic uses reviewContent instead of reviewText ---
  const reviewText = reviewContent; // Keeping reviewText for minimal changes in copy/display logic

  // ✅ Copy functionality (uses reviewText which is now reviewContent)
  const handleCopy = () => {
    if (!reviewText) return;
    navigator.clipboard.writeText(reviewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Loading state
  if (
    isBusinessLoading ||
    isReviewLoading ||
    (!reviewContent && reviewTemplate)
  ) {
    // 💡 Added check for reviewContent to ensure the initial review is generated
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fffaf3] to-[#f8f5f0]">
        <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
      </div>
    );
  }

  // ✅ No data found
  if (!business || !reviewTemplate) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffaf3] text-gray-700">
        <h2 className="text-xl font-semibold mb-3">No Review Found</h2>
        <p className="text-sm text-gray-500">
          We couldn’t generate a review for this business.
        </p>
      </div>
    );
  }

  const handleCopyAndProceed = async () => {
    if (!reviewText || !business?.google_review_url) return;

    try {
      await navigator.clipboard.writeText(reviewText);
      setCopied(true);
      toast.success("Review copied! Redirecting to Google...");

      setTimeout(() => {
        window.location.href = business.google_review_url;
      }, 1500);
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      {/* ... (Logo and Heading remain the same) ... */}

      {/* Logo */}
      {business.logo_url && (
        <div className="mb-2 animate-fade-in">
          <img
            src={business.logo_url}
            alt={business.business_name}
            className=" w-[160px] mx-auto"
          />
        </div>
      )}

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Your review is ready!
      </h1>

      {/* Review Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-md p-5 text-center border border-gray-100 animate-fade-in">
        <div className="flex justify-center gap-0 mb-3">
          {[...Array(moodLevel)].map((_, i) => (
            // <Star key={i} className="text-yellow-400" />
            <span className="text-[28px]">⭐</span>
          ))}
        </div>

        <p className="text-gray-700 text-[24px] font-bold  leading-relaxed whitespace-pre-line">
          {reviewText || "We couldn't generate a review right now."}
        </p>

        <p className="text-[16px] mt-3 text-gray-400 italic">
          ✨ AI-generated review suggestion
        </p>
      </div>

      {/* 💡 FIXED: Refresh Button now calls the generateReview function */}
      <button
        onClick={generateReview}
        className="mt-8 w-full max-w-md bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-800 font-semibold hover:text-gray-900  py-3 rounded-2xl  transition active:scale-95"
      >
        Get a New Review
      </button>

      {/* Submit Review Button */}
      <button
        onClick={handleCopyAndProceed}
        className="mt-2 w-full max-w-md bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-900 font-bold py-3 rounded-2xl  transition active:scale-95"
      >
        {copied ? (
          <span className="flex justify-center items-center gap-2">
            <Check className="h-4 w-4" /> Copied!
          </span>
        ) : (
          <span className="flex justify-center items-center gap-2">
            <Copy className="h-4 w-4" /> Submit Review
          </span>
        )}
      </button>

      {/* Footer */}

      <img className="w-36 mt-12" src="/Logo_3.svg" alt="" />
     
    </div>
  );
};

export default ReviewReady;
