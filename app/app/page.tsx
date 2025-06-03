"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Hammer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/hero-background";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <HeroBackground />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="container relative z-10 px-4 text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
          >
            Own the Future of Auctions.
            <span className="block text-primary">On-Chain. Transparent. Yours.</span>
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            HammerChain brings the transparency and security of blockchain to auctions,
            creating a seamless platform for buying and selling digital assets.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auctions" className="px-8">
                Browse Auctions
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/create" className="px-8">
                Create Auction
              </Link>
            </Button>
          </motion.div>
        </motion.div>
        
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
            }}
          >
            <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground" />
          </motion.div>
        </div>
      </section>
      
      <section className="py-16 bg-muted/20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Auctions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover unique digital assets from creators around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Link href={`/auctions/${i}`} key={i} className="group">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative bg-card rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={`https://images.pexels.com/photos/315${i + 940}/pexels-photo-315${i + 940}.jpeg?auto=compress&cs=tinysrgb&w=800`}
                      alt={`Featured auction ${i}`}
                      className="object-cover transition-transform group-hover:scale-105"
                      fill
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="px-2 py-1 bg-primary/90 text-primary-foreground rounded-md text-sm w-fit mb-2">
                        Ending Soon
                      </div>
                      <h3 className="text-lg font-bold">Digital Masterpiece #{i}</h3>
                      <p className="text-white/90 text-sm">Current bid: {1 + i * 0.5} ETH</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/auctions" className="gap-2">
                View All Auctions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Why Choose HammerChain?</h2>
              <ul className="space-y-4">
                {[
                  {
                    title: "Transparent & Secure",
                    desc: "All auction actions are recorded on-chain, providing complete transparency and security."
                  },
                  {
                    title: "Multiple Auction Types",
                    desc: "Support for English, Dutch, All-Pay, and Vickrey auction formats to suit your needs."
                  },
                  {
                    title: "User-Friendly Interface",
                    desc: "Intuitive design makes it easy to buy, sell, and track auctions."
                  },
                  {
                    title: "Fair & Accessible",
                    desc: "Low fees and open access ensure a level playing field for all participants."
                  }
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/create">Create Your First Auction</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden aspect-square lg:aspect-auto lg:h-[500px]">
              <Image 
                src="https://images.pexels.com/photos/3912976/pexels-photo-3912976.jpeg?auto=compress&cs=tinysrgb&w=1280" 
                alt="Digital art auction"
                fill
                className="object-cover rounded-xl" 
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/0 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}