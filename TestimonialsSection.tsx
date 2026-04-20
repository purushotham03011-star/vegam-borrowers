
import React from 'react';

const Avatar: React.FC<{ gender: 'male' | 'female' }> = ({ gender }) => (
  <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 relative flex-shrink-0">
    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="50" cy="50" r="50" fill={gender === 'female' ? '#FCE7F3' : '#E0F2FE'} />
        {/* Face */}
        <path d="M30 45 C30 70 70 70 70 45 C70 25 30 25 30 45" fill="#FFDFC4" />
        <path d="M30 40 L30 50 L28 50 C25 50 25 40 28 40 Z" fill="#FFDFC4" /> {/* Ear L */}
        <path d="M70 40 L70 50 L72 50 C75 50 75 40 72 40 Z" fill="#FFDFC4" /> {/* Ear R */}
        
        {/* Hair */}
        {gender === 'female' ? (
           <path d="M20 45 C20 10 80 10 80 45 C80 65 85 80 85 90 L15 90 C15 80 20 65 20 45" fill="#374151" />
        ) : (
           <path d="M25 40 C25 15 75 15 75 40 C75 45 75 35 70 30 C60 10 40 10 30 30 C25 35 25 45 25 40" fill="#1F2937" />
        )}
        
        {/* Eyes */}
        <circle cx="40" cy="48" r="2" fill="#1F2937" />
        <circle cx="60" cy="48" r="2" fill="#1F2937" />
        
        {/* Smile */}
        <path d="M40 60 Q50 65 60 60" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" fill="none" />
        
        {/* Body */}
        <path d="M20 90 Q50 110 80 90 L80 100 L20 100 Z" fill={gender === 'female' ? '#EC4899' : '#3B82F6'} />
      </svg>
    </div>
  </div>
);

const ReviewCard: React.FC<{ name: string; text: string; gender: 'male' | 'female' }> = ({ name, text, gender }) => (
  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full min-h-[250px] md:min-h-0">
    <Avatar gender={gender} />
    <div className="flex-grow flex items-center justify-center">
      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 text-center italic line-clamp-4 md:line-clamp-none">
        "{text}"
      </p>
    </div>
    <div className="mt-auto pt-4 border-t border-gray-100 text-center">
      <h4 className="font-bold text-gray-900 font-serif text-base md:text-lg">{name}</h4>
    </div>
  </div>
);

export const TestimonialsSection = () => {
  const reviews = [
    {
      name: "Manasa",
      gender: "female" as const,
      text: "Excellent services and amazing customer service. Team is very responsive and I really appreciate their customer relationship."
    },
    {
      name: "Praneeth",
      gender: "male" as const,
      text: "Excellent hassle-free loan service. My loan got approved, processed and disbursed in just couple of hours. Recommended!"
    },
    {
      name: "Kishore",
      gender: "male" as const,
      text: "The service given by the company is excellent. Within short time quick approval with disbursements process is quite smooth."
    },
    {
      name: "Pranay",
      gender: "male" as const,
      text: "Great service! I got my loan within 20 minutes of documents collection. The folks here are friendly and get the job done!"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900 uppercase tracking-wide mb-4">
            Customer's Saying
          </h2>
          <div className="w-24 h-1.5 bg-violet-600 mx-auto rounded-full"></div>
        </div>
        
        {/* Responsive Layout: Horizontal Scroll Snap on Mobile, Grid on Desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:space-x-0 md:pb-0 no-scrollbar">
          {reviews.map((review, index) => (
            <div key={index} className="min-w-[80vw] sm:min-w-[300px] md:min-w-0 snap-center">
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
        
        {/* Mobile Swipe Indicator */}
        <div className="flex justify-center gap-2 mt-2 md:hidden">
           <div className="w-2 h-2 rounded-full bg-violet-600"></div>
           <div className="w-2 h-2 rounded-full bg-violet-200"></div>
           <div className="w-2 h-2 rounded-full bg-violet-200"></div>
           <div className="w-2 h-2 rounded-full bg-violet-200"></div>
        </div>
      </div>
    </section>
  );
};
