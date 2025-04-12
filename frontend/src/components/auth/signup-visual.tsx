"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const slides = [
  {
    title: "Stay in Control of Your AI Identity",
    description:
      "Your SelfAI dashboard is your mission control — track engagement, update responses, and manage how your AI represents you. All in one place",
    image: "/images/Dashboard.png",
    width: 1100,
    height: 500,
  },
  {
    title: "Share It Anywhere, Instantly",
    description:
      "Distribute your SelfAI via QR code, personal link, or embed — perfect for portfolios, resumes, or networking events. Let others connect, effortlessly",
    image: "/images/QR-share.png",
    width: 350,
    height: 150,
  },
  {
    title: "Your Story, Told Through AI",
    description:
      "Let SelfAI introduce your skills, projects, and personality through dynamic conversations — making you unforgettable, even when you're not around",
    image: "/images/Chat_I.png",
    width: 1100,
    height: 350,
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
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4">
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
