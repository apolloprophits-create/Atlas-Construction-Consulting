import React from 'react';
import { FAQItem } from '../types';
import { HelpCircle } from 'lucide-react';

interface FAQListProps {
  title: string;
  items: FAQItem[];
  className?: string;
  id?: string;
}

const FAQList: React.FC<FAQListProps> = ({ title, items, className = '', id }) => {
  // Generate structured data for this specific FAQ list
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className={`py-16 ${className}`} id={id}>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8 justify-center">
             <HelpCircle className="w-6 h-6 text-brand-secondary" />
             <h2 className="text-2xl font-bold text-brand-dark text-center">{title}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-brand-border shadow-sm h-full">
              <h3 className="font-bold text-lg text-brand-dark mb-3">{item.question}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQList;