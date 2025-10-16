import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Briefcase, Users, MapPin, Star, Phone, Mail } from "lucide-react";

export default function Career() {
  const [loading, setLoading] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
  });

  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {
    const { data } = await supabase
      .from("technicians")
      .select("*")
      .eq("available", true)
      .order("rating", { ascending: false });

    if (data) setTechnicians(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("technician_applications").insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        experience: formData.experience,
      });

      if (error) throw error;

      toast.success("Application submitted successfully! We'll be in touch soon.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        experience: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Water Technician Program</h1>
          <p className="text-xl text-muted-foreground">
            Creating jobs and conserving water across South Africa
          </p>
        </div>

        <Tabs defaultValue="apply" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="apply">Apply for Training</TabsTrigger>
            <TabsTrigger value="find">Find a Technician</TabsTrigger>
          </TabsList>

          <TabsContent value="apply">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-primary" />
                    Become a Water Technician
                  </CardTitle>
                  <CardDescription>
                    Gain training, jobs, and income through sensor installation & maintenance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+27 XX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Johannesburg, Soweto"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience (Optional)</Label>
                      <Textarea
                        id="experience"
                        placeholder="Tell us about any relevant experience..."
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-gradient-primary" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-gradient-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle>Program Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-foreground/20 p-2 rounded">✓</div>
                      <div>
                        <div className="font-semibold">Free Training</div>
                        <div className="text-sm opacity-90">
                          Comprehensive IoT sensor and plumbing training
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-foreground/20 p-2 rounded">✓</div>
                      <div>
                        <div className="font-semibold">Job Placement</div>
                        <div className="text-sm opacity-90">
                          Direct connections with households and municipalities
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-foreground/20 p-2 rounded">✓</div>
                      <div>
                        <div className="font-semibold">Flexible Income</div>
                        <div className="text-sm opacity-90">Earn as you help conserve water</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary-foreground/20 p-2 rounded">✓</div>
                      <div>
                        <div className="font-semibold">Community Impact</div>
                        <div className="text-sm opacity-90">
                          Make a difference in South Africa's water security
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Training Program</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-semibold">4 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-semibold">Johannesburg CBD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="font-semibold text-success">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Certificate:</span>
                      <span className="font-semibold">Included</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="find">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Find Water Technicians Near You
                </CardTitle>
                <CardDescription>
                  Certified technicians available for sensor installation and leak repairs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {technicians.map((tech) => (
                    <Card key={tech.id} className="hover:shadow-water transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{tech.full_name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {tech.location}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-success/10 px-2 py-1 rounded">
                            <Star className="h-4 w-4 fill-success text-success" />
                            <span className="font-semibold">{tech.rating}</span>
                          </div>
                        </div>

                        <Badge variant="secondary" className="mb-3">
                          {tech.specialization}
                        </Badge>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            {tech.phone}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {tech.email}
                          </div>
                        </div>

                        <Button 
                          className="w-full mt-4" 
                          variant="outline"
                          onClick={() => {
                            window.location.href = `mailto:${tech.email}?subject=Water Technician Service Request&body=Hi ${tech.full_name},%0D%0A%0D%0AI would like to request your services for water conservation and leak repair.%0D%0A%0D%0APlease contact me at your earliest convenience.`;
                          }}
                        >
                          Contact Technician
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {technicians.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No technicians available yet. Check back soon!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
