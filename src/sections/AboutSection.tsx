import { motion } from 'framer-motion';
import { useContentStore } from '@/store/contentStore';

export function AboutSection() {
  const { getValue } = useContentStore();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src="/images/hannah-about.jpg" alt="Hannah organising" className="w-full rounded-lg shadow-lg" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-xl font-bold">O</span>
              </div>
              <h2 className="text-3xl font-bold text-primary">{getValue('about', 'title', 'About Hannah')}</h2>
            </div>
            <h3 className="text-xl text-primary italic mb-6 text-center">My Purpose and Passion</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              My love for organising goes way back to my childhood, and I&apos;ve made it my <strong>mission to help people</strong> create spaces that truly work for them. With over 10 years of experience, I&apos;m all about making a positive impact in the lives of others. Through Organised With Hannah, I work with individuals and businesses to <strong>declutter, organise, and transform their spaces</strong>&mdash;whether it&apos;s a home, office, or commercial space. My goal? To bring <strong>function</strong>, <strong>purpose</strong>, and <strong>joy</strong> to the spaces I work on, helping people live their best, most organised lives.
            </p>
            <p className="text-gray-700 leading-relaxed">
              What drives me even more than my love of organising is my passion for <strong>supporting</strong>, <strong>encouraging</strong>, and <strong>educating</strong> others along their life journey. My heart is with the people I work with, and I&apos;m dedicated to helping them build confidence and independence, so they can thrive in every area of their lives.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
