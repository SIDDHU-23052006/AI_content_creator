import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ================= ANIMATION VARIANTS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function Intro() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
  const loggedIn = localStorage.getItem("isLoggedIn");
  if (loggedIn) {
    navigate("/home");
  } else {
    navigate("/sign");
  }
};


  return (
    <div className="w-full bg-[#0b0b14] text-white overflow-hidden">

      {/* ================= NAVBAR ================= */}
      <motion.nav
        variants={fade}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1 }}
        className="fixed top-0 left-0 w-full z-50 px-12 py-6 flex justify-between items-center bg-black/60 backdrop-blur-lg"
      >
        <div className="flex gap-8 text-sm font-medium">
          <a href="#explore" className="hover:text-purple-400">Explore</a>
          <a href="#partners" className="hover:text-purple-400">Partners</a>
          <a href="#contact" className="hover:text-purple-400">Contact</a>
          <Link to="/sign" className="hover:text-purple-400">Sign In</Link>
        </div>

        <div className="flex items-center gap-2">
          <img src="/infosys-dark.png" className="h-8" alt="logo" />
          <span className="font-semibold tracking-wide">Info Creator</span>
        </div>
      </motion.nav>

      {/* ================= HERO ================= */}
      <section
        className="relative min-h-screen flex items-center px-20 pt-32"
        style={{
          backgroundImage: "url('/create_account.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl"
        >
          <h1 className="text-6xl font-bold leading-tight mb-6">
            A New Way to <br />
            <span className="text-purple-400">Create Content</span>
          </h1>

          <p className="text-lg text-gray-300 mb-10">
            AI-powered platform to generate LinkedIn posts, blogs, emails,
            advertisements and social content instantly.
          </p>

          <div className="flex gap-6">
            <a
              href="#explore"
              className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-700 transition font-semibold"
            >
              Start Exploring →
            </a>

            <button
  onClick={() => navigate("/sign?mode=signup")}
  className="px-8 py-3 rounded-full border border-white/40 hover:bg-white/10 transition"
>
  Create Account
</button>



          </div>
        </motion.div>
      </section>

      {/* ================= EXPLORE ================= */}
      <section
        id="explore"
        className="relative py-40 px-16 bg-gradient-to-b from-[#0b0b14] to-[#111128]"
      >
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-28"
        >
          Explore AI Content Creation
        </motion.h2>

        <div className="max-w-6xl mx-auto space-y-28">
          <StackCard title="Blog Writing" desc="SEO-optimized long-form blogs with structure & clarity." image="/blog.png" align="right" />
          <StackCard title="LinkedIn Content" desc="Professional posts built for reach & engagement." image="/linkedin.png" align="left" />
          <StackCard title="Advertisements" desc="High-converting ad copies for all platforms." image="/advertisment.png" align="right" />
          <StackCard title="Email Campaigns" desc="Cold emails & newsletters that convert." image="/email.png" align="left" />
          <StackCard title="Tweet Generator" desc="Short, viral tweets crafted for engagement." image="/tweet.png" align="right" />
        </div>
      </section>

      {/* ================= PARTNERS ================= */}
      <section id="partners" className="py-28 bg-[#0b0b14] text-center">
        <motion.h3
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold mb-14"
        >
          Trusted by platforms creators love
        </motion.h3>

        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-wrap justify-center items-center gap-16 opacity-80"
        >
          <img src="/facebook.jpg" className="h-10 grayscale hover:grayscale-0 transition" />
          <img src="/google-logo.jpg" className="h-10 grayscale hover:grayscale-0 transition" />
          <img src="/insta-logo.jpg" className="h-10 grayscale hover:grayscale-0 transition" />
          <img src="/linkedin-logo.png" className="h-10 grayscale hover:grayscale-0 transition" />
          <img src="/tweet-logo.png" className="h-10 grayscale hover:grayscale-0 transition" />
        </motion.div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="bg-[#0b0b14] py-36 text-center">
        <motion.h3
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold max-w-4xl mx-auto mb-10"
        >
          If you are passionate about tackling some most interesting content,
          we would love to hear from you
        </motion.h3>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex justify-center gap-6"
        >
          <Link
            to="/profile"
            className="px-10 py-4 rounded-full bg-purple-600 hover:bg-purple-700 transition font-semibold"
          >
            Join Our Team →
          </Link>

          {/* ✅ GET STARTED → HOME PAGE */}
          <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={handleGetStarted}
  className="px-10 py-4 rounded-full border border-white/40 hover:bg-white/10 transition"
>
  Get Started →
</motion.button>

        </motion.div>
      </section>
    </div>
  );
}

/* ================= STACK CARD ================= */
function StackCard({ title, desc, image, align }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`relative flex ${align === "left" ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`relative w-[80%] h-80 rounded-3xl overflow-hidden shadow-2xl
        ${align === "left" ? "-rotate-2" : "rotate-2"}
        hover:rotate-0 hover:scale-[1.03] transition duration-500`}
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute bottom-8 left-8">
          <h4 className="text-3xl font-bold mb-2">{title}</h4>
          <p className="text-gray-300 max-w-md">{desc}</p>
        </div>
      </div>
    </motion.div>
  );
}
