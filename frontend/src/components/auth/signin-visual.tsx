"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const slides = [
  {
    title: "Bring your AI to any site",
    description:
      "Embed your SelfAI widget on your personal website, portfolio, or blog — so visitors can instantly connect and learn more about you.",
    image: "/images/Widget_Together.png",
    width: 350,
    height: 150,
  },
  {
    title: "See how your AI performed",
    description:
      "Review your chat engagement, visitor activity, and insights gathered while you were offline.",
    image: "/images/Analytics.png",
    width: 1100,
    height: 500,
  },
  {
    title: "Keep building your presence",
    description:
      "Update your data, share new projects, and make sure your AI reflects the latest version of you.",
    image: "/images/Profile-progress-bar.png",
    width: 400,
    height: 150,
  },
];
export default function SignUpVisual() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full w-full bg-indigo-600 p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="max-w-4xl relative min-h-[600px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-8">
              <Image
                src={slides[current].image}
                alt={slides[current].title}
                width={slides[current].width}
                height={slides[current].height}
                className="object-contain rounded-xl"
                priority
              />
            </div>
            <div className="w-[80%]">
              <h2 className="text-2xl font-semibold text-white mb-4">
                {slides[current].title}
              </h2>
              <p className="text-indigo-100 text-base leading-relaxed">
                {slides[current].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center gap-2 pb-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === current
                  ? "bg-white w-8"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
