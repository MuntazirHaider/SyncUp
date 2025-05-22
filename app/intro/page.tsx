"use client";

import { useRouter } from "next/navigation";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  motion,
  useAnimation,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Server,
  Users,
  MessageSquare,
  Video,
  File,
  Lock,
  Link as LinkIcon,
  User2,
  Mic2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Feature data
const features = [
  {
    icon: Server,
    title: "Multi-Server Spaces",
    desc: "Create and manage unlimited servers for any community or project.",
  },
  {
    icon: MessageSquare,
    title: "Text Channels",
    desc: "Chat in real time with your friends and teammates.",
  },
  {
    icon: Video,
    title: "Audio & Video Channels",
    desc: "Jump into voice or video calls for seamless collaboration.",
  },
  {
    icon: Users,
    title: "Role-Based Access",
    desc: "Assign admin, moderator, or guest roles to control permissions.",
  },
  {
    icon: User2,
    title: "Personal Chats",
    desc: "DM anyone, anytime, for private conversations.",
  },
  {
    icon: LinkIcon,
    title: "Invite Links",
    desc: "Share instant invite links to grow your community.",
  },
  {
    icon: File,
    title: "File Sharing",
    desc: "Send images, docs, and more directly in any channel.",
  },
  {
    icon: Mic2,
    title: "Live Collaboration",
    desc: "Work together in real time with voice and video.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    desc: "Your conversations are safe and encrypted.",
  },
];

function InteractiveCard({ icon: Icon, title, desc }: any) {
  const ref = useRef<HTMLDivElement>(null);
  // Use motion values for smooth animation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    rotateX.set((y / rect.height) * 15);
    rotateY.set(-(x / rect.width) * 15);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="group bg-white/90 border border-gray-200 rounded-2xl p-6 shadow hover:shadow-2xl transition-shadow duration-300 flex flex-col items-start relative overflow-hidden"
      style={{
        perspective: 700,
        rotateX: springX,
        rotateY: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 8px 32px 0 rgba(80, 0, 120, 0.13)",
      }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        className="bg-gradient-to-tr from-purple-400 via-fuchsia-400 to-blue-400 p-3 rounded-full mb-3 shadow"
        whileHover={{ rotate: 20, scale: 1.15 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <Icon className="w-6 h-6 text-white drop-shadow" />
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();

  // Header shimmer effect
  const shimmerVariants = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // For feature grid entrance
  const featureGridRef = useRef(null);
  const inView = useInView(featureGridRef, { once: true });
  const controls = useAnimation();
  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-100 flex flex-col items-center overflow-x-hidden">
      {/* Animated Gradient Background Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 h-96 w-full bg-gradient-to-tr from-purple-300 via-fuchsia-300 to-blue-300 blur-3xl opacity-30 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Header Section */}
      <header className="relative z-10 w-full flex flex-col items-center pt-20 pb-8">
        {/* Creative Animated Logo */}
        <motion.div
          className="mb-6 flex justify-center items-center"
          initial={{ y: -10, rotate: -4, scale: 1 }}
          animate={{
            y: [-10, 0, -10],
            rotate: [-4, 4, -4],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          whileHover={{
            scale: 1.12,
            rotate: 0,
            transition: { type: "spring", stiffness: 180, damping: 12 },
          }}
          style={{ width: 120, height: 120 }} // Increased size
        >
          <img
            src="https://jn51c7mn3k.ufs.sh/f/A7wRGFfLGbsQJimpLbe1Ji4GevDHYTXsqomwg521pMBaObP0"
            alt="SyncUp Logo"
            className="w-36 h-28 md:w-40 md:h-28 rounded-full shadow-lg bg-white object-cover"
            draggable={false}
            style={{ userSelect: "none" }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg relative"
        >
          <motion.span
            variants={shimmerVariants}
            animate="animate"
            className="block bg-[linear-gradient(110deg,#fff,45%,#f0c6f8,55%,#fff)] bg-[length:200%_200%] bg-clip-text text-transparent"
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            SyncUp
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-4 text-base md:text-lg text-gray-700 max-w-xl text-center"
        >
          The ultimate platform for real-time collaboration. Create your own
          spaces with text, voice, and video channels, manage roles, share
          files, and build communities your way.
        </motion.p>
        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 90,
            damping: 12,
          }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <SignedOut>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => router.push("/sign-up")}
                className="min-w-80 bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-base px-8 py-3 rounded-xl font-semibold shadow-md transition-all"
              >
                Start Your Community
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="outline"
                onClick={() => router.push("/sign-in")}
                className="min-w-80 border-purple-300 text-purple-700 hover:bg-purple-100/70 hover:text-purple-900 text-base px-8 py-3 rounded-xl font-semibold"
              >
                Existing Community? Sign In
              </Button>
            </motion.div>
          </SignedOut>
          <SignedIn>
            <div className="text-purple-700 font-medium text-base px-4 py-3 bg-purple-100/60 rounded-xl shadow">
              🎉 Welcome back to your community!
            </div>
          </SignedIn>
        </motion.div>
      </header>

      {/* Features Showcase */}
      <section className="relative z-10 w-full max-w-5xl mx-auto mt-12 px-4 pb-20">
        <motion.div
          ref={featureGridRef}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.96 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 18,
                mass: 0.7,
              }}
            >
              <InteractiveCard {...feature} />
            </motion.div>
          ))}
        </motion.div>
        {/* Animated underline for extra "wow" */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 1, type: "spring" }}
          className="mx-auto mt-12 h-1 w-2/3 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 rounded-full origin-left"
        />
      </section>
    </div>
  );
}
