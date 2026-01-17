const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-navy-light to-primary"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Hear From These <span className="italic font-serif text-teal">Impactful</span>
          </h2>
          <p className="text-3xl md:text-5xl font-bold">
            Businesses & Individuals:
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent"></div>
    </section>
  );
};

export default TestimonialsSection;