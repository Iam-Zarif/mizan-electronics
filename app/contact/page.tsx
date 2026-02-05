"use client";

import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="relative pt-6 overflow-hidden">
      <motion.div
        className="absolute -z-10 left-[-30%] top-[10%] h-[32.5rem] w-[32.5rem] rounded-full bg-indigo-500/20 blur-[160px]"
        animate={{ x: [0, 120, 0], y: [0, -80, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -z-10 right-[-25%] bottom-[5%] h-[32.5rem] w-[32.5rem] rounded-full bg-pink-500/20 blur-[160px]"
        animate={{ x: [0, -120, 0], y: [0, 80, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="mx-auto max-w-7xl px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Contact MIZAN ELECTRONICS
          </h1>
          <p className="mt-4 text-neutral-600 dark:text-neutral-300">
            Reach out for product inquiries, installation support, or service assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div className="space-y-10">
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/60 backdrop-blur-xl p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]">
              <h3 className="text-xl font-bold mb-6 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Contact Information
              </h3>

              <div className="space-y-5 text-sm">
                <InfoRow
                  icon={<MapPin />}
                  label="Address"
                  value="LK Plaza, Dhaka 1230, Bangladesh"
                />
                <InfoRow
                  icon={<Phone />}
                  label="Phone"
                  value="+880 1234 567 890"
                />
                <InfoRow
                  icon={<Mail />}
                  label="Email"
                  value="support@mizanelectronics.com"
                />
              </div>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/60 backdrop-blur-xl p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] space-y-5"
          >
            <h3 className="text-xl font-bold mb-2 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Send Us a Message
            </h3>

            <Input placeholder="Full Name" />
            <Input type="email" placeholder="Email Address" />
            <Input placeholder="Subject" />
            <Textarea placeholder="Your Message" />

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95"
            >
              Send Message
              <Send className="h-4 w-4" />
            </motion.button>
          </motion.form>
        </div>
      </div>

      <div className="w-full border-t border-black/10 dark:border-white/10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d228.05118722637374!2d90.42540447549791!3d23.860560362397848!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c5d8dda21269%3A0xcbab59a170bfbbf2!2sLK%20PLaza%2C%20Dhaka%201230!5e0!3m2!1sen!2sbd!4v1768852056193!5m2!1sen!2sbd"
          className="h-[35rem] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600">
        {icon}
      </div>
      <div>
        <p className="font-semibold">{label}</p>
        <p className="text-neutral-600 dark:text-neutral-300">{value}</p>
      </div>
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={5}
      className="w-full resize-none rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
    />
  );
}
