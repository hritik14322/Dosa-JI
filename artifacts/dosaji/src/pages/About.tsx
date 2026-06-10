export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Our Story</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="bg-muted rounded-2xl h-80 overflow-hidden relative">
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/10">Image Placeholder</div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold font-serif">From humble beginnings</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Dosa Ji started in a small street corner with a simple mission: to serve the most authentic, crispy, and delicious dosas in the neighborhood.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Over the years, we've expanded our menu to include mouth-watering pizzas, burgers, and rolls, but our commitment to quality ingredients and traditional recipes remains unchanged. Every dish is crafted with love and served with a smile.
          </p>
        </div>
      </div>
      
      <div className="bg-primary/5 rounded-3xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold font-serif mb-8">Our Values</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
            <h3 className="text-xl font-bold mb-2">Quality First</h3>
            <p className="text-muted-foreground">We never compromise on ingredients. Fresh, locally sourced produce goes into every meal.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
            <h3 className="text-xl font-bold mb-2">Authentic Taste</h3>
            <p className="text-muted-foreground">Our recipes have been passed down through generations to ensure that true authentic flavor.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-muted-foreground">We are more than just a restaurant; we are a gathering place for friends and family.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
