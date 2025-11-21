import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  MousePointer, 
  Smartphone, 
  Zap, 
  PaintbrushVertical, 
  BarChart, 
  Globe,
  Star,
  ArrowRight,
  Image,
  Video,
  Mail,
  Type
} from "lucide-react";

export default function Landing() {
  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  const handleStartBuilding = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Palette className="text-white text-sm" />
                </div>
                <span className="ml-3 text-xl font-bold text-slate-900">CreativePort</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="#templates" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Templates</a>
                <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Features</a>
                <a href="#examples" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Examples</a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Pricing</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={handleSignIn}>Sign In</Button>
              <Button onClick={handleStartBuilding}>Start Building</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Build stunning portfolios<br/>
              <span className="text-blue-500">without coding</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Create professional portfolios with our intuitive drag-and-drop builder. 
              Perfect for designers, photographers, artists, and creatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleStartBuilding}>
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                View Examples
              </Button>
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="mt-16 relative">
            <img 
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675" 
              alt="Creative workspace with portfolio building interface" 
              className="rounded-2xl shadow-2xl w-full" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section id="templates" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Choose from stunning templates
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start with professionally designed templates tailored for different creative fields
            </p>
          </div>

          {/* Template Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button className="rounded-full">All Templates</Button>
            <Button variant="outline" className="rounded-full">Photography</Button>
            <Button variant="outline" className="rounded-full">Design</Button>
            <Button variant="outline" className="rounded-full">Art</Button>
            <Button variant="outline" className="rounded-full">Architecture</Button>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Minimal Studio",
                description: "Perfect for photographers who want clean, elegant galleries",
                category: "Photography",
                image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              },
              {
                title: "Design Pro",
                description: "Showcase your UI/UX projects with interactive previews",
                category: "Design",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              },
              {
                title: "Creative Canvas",
                description: "Bold layouts for artists and creative professionals",
                category: "Art",
                image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              },
              {
                title: "Architecture Hub",
                description: "Professional layouts for architects and planners",
                category: "Architecture",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              },
              {
                title: "Fashion Focus",
                description: "Elegant templates for fashion and lifestyle photography",
                category: "Photography",
                image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              },
              {
                title: "Tech Startup",
                description: "Modern layouts for digital products and startups",
                category: "Design",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              }
            ].map((template, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={template.image} 
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{template.title}</h3>
                  <p className="text-slate-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{template.category}</Badge>
                    <Button variant="ghost" size="sm">
                      Preview <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Editor Demo */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Visual editor that feels like magic
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Build your portfolio with our intuitive drag-and-drop interface. No coding required.
            </p>
          </div>

          {/* Editor Interface Mockup */}
          <div className="bg-slate-100 rounded-2xl p-8 shadow-2xl">
            {/* Editor Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-6">
                  <Button variant="ghost" size="sm">
                    <MousePointer className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                  <Button variant="ghost" size="sm">
                    <PaintbrushVertical className="mr-2 h-4 w-4" />
                    Design
                  </Button>
                  <Button variant="ghost" size="sm">
                    Settings
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                  <Button size="sm">
                    Publish
                  </Button>
                </div>
              </div>
            </div>

            {/* Editor Canvas */}
            <div className="bg-white rounded-lg shadow-sm min-h-[600px] relative">
              {/* Left Sidebar - Blocks */}
              <div className="absolute left-0 top-0 w-64 h-full bg-slate-50 border-r border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Content Blocks</h3>
                <div className="space-y-2">
                  {[
                    { icon: Image, name: "Gallery" },
                    { icon: Type, name: "Text Block" },
                    { icon: Mail, name: "Contact Form" },
                    { icon: Video, name: "Video" }
                  ].map((block, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 border border-slate-200 hover:border-blue-500 cursor-pointer transition-colors group">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <block.icon className="text-slate-600 h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700">{block.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Canvas */}
              <div className="ml-64 p-8">
                <div className="space-y-8">
                  {/* Hero Section */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer group">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-slate-900 mb-4">Sarah Chen</h1>
                      <p className="text-xl text-slate-600 mb-6">UI/UX Designer & Creative Director</p>
                      <div className="flex justify-center">
                        <div className="w-32 h-32 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Gallery Section */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 hover:border-blue-500 transition-colors cursor-pointer">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Projects</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="h-32 bg-slate-200 rounded-lg"></div>
                      <div className="h-32 bg-slate-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Properties */}
              <div className="absolute right-0 top-0 w-64 h-full bg-slate-50 border-l border-slate-200 p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">Properties</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Background Color</label>
                    <div className="flex space-x-2">
                      <div className="w-8 h-8 bg-white border-2 border-slate-300 rounded cursor-pointer"></div>
                      <div className="w-8 h-8 bg-slate-100 border-2 border-slate-300 rounded cursor-pointer"></div>
                      <div className="w-8 h-8 bg-blue-500 border-2 border-blue-500 rounded cursor-pointer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From design to deployment, we've got all the tools to make your portfolio shine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MousePointer,
                title: "Drag & Drop Builder",
                description: "Create stunning layouts with our intuitive visual editor. No coding knowledge required.",
                color: "bg-blue-100 text-blue-500"
              },
              {
                icon: Smartphone,
                title: "Mobile Responsive",
                description: "Your portfolio looks perfect on all devices. Built-in responsive design ensures great user experience.",
                color: "bg-emerald-100 text-emerald-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized for speed and performance. Your portfolio loads quickly and ranks well in search engines.",
                color: "bg-purple-100 text-purple-500"
              },
              {
                icon: PaintbrushVertical,
                title: "Custom Styling",
                description: "Full control over colors, fonts, and layouts. Make your portfolio truly unique to your brand.",
                color: "bg-orange-100 text-orange-500"
              },
              {
                icon: BarChart,
                title: "Analytics",
                description: "Track visitors, page views, and engagement. Understand how your portfolio performs.",
                color: "bg-pink-100 text-pink-500"
              },
              {
                icon: Globe,
                title: "Custom Domain",
                description: "Connect your own domain name for a professional online presence. SSL included for security.",
                color: "bg-blue-100 text-blue-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Examples */}
      <section id="examples" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              See what creators are building
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get inspired by real portfolios created with CreativePort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                name: "Alex Rodriguez",
                title: "Landscape Photographer",
                quote: "CreativePort made it so easy to showcase my work. The templates are beautiful and the editor is incredibly intuitive.",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              },
              {
                name: "Maya Patel",
                title: "Brand Designer",
                quote: "The customization options are endless. I was able to create a portfolio that perfectly represents my design aesthetic.",
                image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              }
            ].map((example, index) => (
              <div key={index} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
                  <img 
                    src={example.image} 
                    alt={`${example.name} portfolio`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">{example.name}</h3>
                  <p className="text-slate-600 mb-4">{example.title}</p>
                  <p className="text-slate-600">"{example.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the plan that's right for you. All plans include core features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$0",
                features: ["1 Portfolio Website", "Basic Templates", "Mobile Responsive", "CreativePort Subdomain"],
                cta: "Get Started Free",
                popular: false
              },
              {
                name: "Professional",
                price: "$12",
                features: ["5 Portfolio Websites", "All Premium Templates", "Custom Domain", "Advanced Analytics", "Email Support"],
                cta: "Start Pro Trial",
                popular: true
              },
              {
                name: "Business",
                price: "$29",
                features: ["Unlimited Websites", "White-label Options", "E-commerce Integration", "Priority Support", "Team Collaboration"],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`p-8 relative ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : 'shadow-lg hover:shadow-xl'} transition-shadow`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-600">/month</span>
                  </div>
                  <ul className="text-left space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Star className="text-emerald-500 mr-3 h-4 w-4" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? '' : 'variant-outline'}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to build your portfolio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creatives who trust CreativePort to showcase their work professionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={handleStartBuilding}>
              Start Building for Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-500">
              View Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Palette className="text-white text-sm" />
                </div>
                <span className="ml-3 text-xl font-bold">CreativePort</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                The easiest way for creatives to build stunning portfolios and showcase their work online.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">© 2024 CreativePort. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
