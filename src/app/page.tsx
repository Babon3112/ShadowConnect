"use client";
import { MessagesSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-[#E0E0E0] overflow-hidden">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-[#5D5FEF]">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-[#B0BEC5]">
            ShadowConnect - Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-[#2C2C2C] shadow-lg rounded-lg border border-[#4C4C6D]">
                  <CardHeader className="bg-[#3A3A3A] text-[#E0E0E0] rounded-t-lg border-b border-[#4C4C6D]">
                    <CardTitle className="text-lg md:text-xl text-[#5D5FEF]">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4 p-4">
                    <MessagesSquare className="flex-shrink-0 text-[#4B4BCB]" />
                    <div>
                      <p className="text-[#B0BEC5]">{message.content}</p>
                      <p className="text-xs text-[#78909C]">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
      <footer className="text-center p-4 md:p-6 bg-[#2C2C2C] text-[#B0BEC5] w-full border-t border-[#4C4C6D]">
        © 2024 ShadowConnect. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
