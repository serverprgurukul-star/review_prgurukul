import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const DEFAULT_MOODS = [
  { level: 5, emoji: "😍", label: "Fantastic", color: "from-blue-400 to-blue-600" },
  // { level: 4, emoji: "🙂", label: "loved it", color: "from-green-400 to-green-600" },
  // { level: 3, emoji: "😐", label: "Neutral", color: "from-gray-400 to-gray-600" },
  // { level: 2, emoji: "😕", label: "Average", color: "from-orange-400 to-orange-600" },
  // { level: 1, emoji: "😡", label: "Disappointing", color: "from-red-400 to-red-600" },
];

const BusinessLanding = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: business, isLoading } = useQuery({
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

  const handleMoodSelect = (moodLevel: number) => {
    navigate(`/review/${slug}/${moodLevel}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="text-center text-gray-700 animate-fade-in">
          <h1 className="text-3xl font-bold mb-3">Business Not Found</h1>
          <p className="text-gray-500">This review link is not active.</p>
        </div>
      </div>
    );
  }

  // Mood logic
  const count = business?.mood_count || 5;

  // Always get moods in correct order 5 → 4 → 3 → 2 → 1
  const baseMoods = DEFAULT_MOODS.slice(0, count);

  const customMoods = (business?.mood_images || []).slice(0, count);

  const MOODS =
    customMoods.length > 0
      ? baseMoods.map((base, i) => ({
          level: base.level,
          label: base.label,
          color: base.color,
          image: customMoods[i], // Only replace the image
        }))
      : baseMoods;

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800">

      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4 py-10 sm:px-6 text-center"
      >
        {/* Logo */}
        {business.logo_url && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="p-4 bg-white/60 backdrop-blur-xl rounded-2xl shadow-md border border-white/40">
              <img
                src={business.logo_url}
                alt={business.business_name}
                className="h-20 w-20 object-contain rounded-xl"
              />
            </div>
          </motion.div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{business.business_name}</h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          How was your experience with us today?
        </p>

        {/* Moods Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 justify-center">
          {MOODS.map((mood, index) => (
            <motion.button
              key={mood.level}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleMoodSelect(mood.level)}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl text-white font-semibold 
                shadow-md hover:shadow-lg bg-gradient-to-br ${mood.color}
                focus:outline-none transition-all duration-300`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {mood.image ? (
                <img
                  src={mood.image}
                  alt={mood.label}
                  className="h-8 w-8 sm:h-10 sm:w-10 mb-2 object-contain drop-shadow-md"
                />
              ) : (
                <span className="text-3xl sm:text-4xl mb-1">{mood.emoji}</span>
              )}
              <span className="text-xs sm:text-sm font-medium">{mood.label}</span>
            </motion.button>
          ))}
        </div>

        <div className="h-px w-2/3 bg-gray-200 my-10 mx-auto" />

        <p className="text-gray-500 text-sm">
          Your feedback helps us improve 💬
        </p>
      </motion.div>
    </div>
  );
};

export default BusinessLanding;
