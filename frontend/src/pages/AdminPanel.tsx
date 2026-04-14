import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { API_BASE_URL, ENDPOINTS } from "@/lib/api-config";
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Mail,
  Stethoscope,
  Trash2,
  UserRound,
  Pencil,
} from "lucide-react";
import { removeServiceCharacteristics, setServiceCharacteristics } from "@/hooks/use-services";

type Section = "dashboard" | "services" | "team" | "appointments" | "messages";

interface Appointment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

interface MessageItem {
  id: number;
  Name: string;
  Email: string;
  Subject: string;
  Message: string;
  Message_date: string;
}

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  price: string;
  features?: string[];
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  experience?: string;
  specialization?: string;
}

const SERVICE_FEATURES_STORAGE_KEY = "service-features-map";

function getStoredServiceFeaturesMap(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(SERVICE_FEATURES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [serviceImage, setServiceImage] = useState<File | null>(null);
  const [teamImage, setTeamImage] = useState<File | null>(null);

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    icon: "🦷",
    price: "",
    features: [] as string[],
    featureInput: "",
  });
  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    bio: "",
    experience: "",
    specialization: "",
  });

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Token ${token}` } : {};
  }, []);

  const refreshAll = async () => {
    setLoading(true);
    try {
      const [appointmentRes, messageRes, serviceRes, teamRes] = await Promise.all([
        fetch(`${API_BASE_URL}${ENDPOINTS.appointments}`),
        fetch(`${API_BASE_URL}${ENDPOINTS.messages}`),
        fetch(`${API_BASE_URL}${ENDPOINTS.services}`),
        fetch(`${API_BASE_URL}${ENDPOINTS.team}`),
      ]);
      const [appointmentData, messageData, serviceData, teamData] = await Promise.all([
        appointmentRes.json(),
        messageRes.json(),
        serviceRes.json(),
        teamRes.json(),
      ]);
      const featuresMap = getStoredServiceFeaturesMap();
      const hydratedServices = (serviceData as ServiceItem[]).map((service) => ({
        ...service,
        features: featuresMap[String(service.id)] || service.features || [],
      }));
      setAppointments(appointmentData);
      setMessages(messageData);
      setServices(hydratedServices);
      setTeam(teamData);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/admin-login");
      return;
    }
    void refreshAll();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/admin-login");
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", serviceForm.title);
    formData.append("name", serviceForm.title);
    formData.append("description", serviceForm.description);
    formData.append("icon", serviceForm.icon);
    formData.append("price", serviceForm.price);
    if (serviceImage) formData.append("image", serviceImage);

    const endpoint = editingServiceId
      ? `${API_BASE_URL}${ENDPOINTS.services}${editingServiceId}/`
      : `${API_BASE_URL}${ENDPOINTS.services}`;
    const method = editingServiceId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { ...authHeaders },
      body: formData,
    });

    if (!response.ok) {
      toast({ title: "Error", description: "Failed to save service", variant: "destructive" });
      return;
    }

    const savedService = (await response.json()) as ServiceItem;
    const features = serviceForm.features.map((f) => f.trim()).filter(Boolean);
    if (savedService.id && features.length > 0) setServiceCharacteristics(savedService.id, features);

    toast({ title: "Success", description: "Service saved successfully" });
    setServiceForm({ title: "", description: "", icon: "🦷", price: "", features: [], featureInput: "" });
    setServiceImage(null);
    setEditingServiceId(null);
    void refreshAll();
  };

  const addFeatureChip = () => {
    const next = serviceForm.featureInput.trim();
    if (!next) return;
    if (serviceForm.features.some((f) => f.toLowerCase() === next.toLowerCase())) {
      setServiceForm((prev) => ({ ...prev, featureInput: "" }));
      return;
    }
    setServiceForm((prev) => ({
      ...prev,
      features: [...prev.features, next],
      featureInput: "",
    }));
  };

  const removeFeatureChip = (feature: string) => {
    setServiceForm((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", teamForm.name);
    formData.append("role", teamForm.role);
    formData.append("bio", teamForm.bio);
    formData.append("experience", teamForm.experience);
    formData.append("specialization", teamForm.specialization);
    if (teamImage) formData.append("image", teamImage);

    const endpoint = editingTeamId
      ? `${API_BASE_URL}${ENDPOINTS.team}${editingTeamId}/`
      : `${API_BASE_URL}${ENDPOINTS.team}`;
    const method = editingTeamId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { ...authHeaders },
      body: formData,
    });

    if (!response.ok) {
      toast({ title: "Error", description: "Failed to save team member", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Team member saved successfully" });
    setTeamForm({ name: "", role: "", bio: "", experience: "", specialization: "" });
    setTeamImage(null);
    setEditingTeamId(null);
    void refreshAll();
  };

  const deleteService = async (id: number) => {
    if (!window.confirm("Delete this service?")) return;
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.services}${id}/`, {
      method: "DELETE",
      headers: { ...authHeaders },
    });
    if (!response.ok) {
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
      return;
    }
    removeServiceCharacteristics(id);
    toast({ title: "Deleted", description: "Service removed" });
    void refreshAll();
  };

  const deleteTeamMember = async (id: number) => {
    if (!window.confirm("Delete this team member?")) return;
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.team}${id}/`, {
      method: "DELETE",
      headers: { ...authHeaders },
    });
    if (!response.ok) {
      toast({ title: "Error", description: "Failed to delete team member", variant: "destructive" });
      return;
    }
    toast({ title: "Deleted", description: "Team member removed" });
    void refreshAll();
  };

  const updateAppointmentStatus = async (id: number, status: Appointment["status"]) => {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.appointments}${id}/status/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      toast({ title: "Error", description: "Failed to update appointment", variant: "destructive" });
      return;
    }
    toast({ title: "Updated", description: "Appointment status updated" });
    void refreshAll();
  };

  const deleteAppointment = async (id: number) => {
    if (!window.confirm("Delete this appointment record?")) return;
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.appointments}${id}/`, {
      method: "DELETE",
      headers: { ...authHeaders },
    });
    if (!response.ok) {
      toast({ title: "Error", description: "Failed to delete appointment", variant: "destructive" });
      return;
    }
    toast({ title: "Deleted", description: "Appointment removed" });
    void refreshAll();
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm("Delete this message?")) return;
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.messages}${id}/`, {
      method: "DELETE",
      headers: { ...authHeaders },
    });
    if (!response.ok) {
      toast({ title: "Error", description: "Failed to delete message", variant: "destructive" });
      return;
    }
    toast({ title: "Deleted", description: "Message removed" });
    void refreshAll();
  };

  const navItems = [
    { key: "dashboard" as Section, label: "Dashboard", icon: LayoutDashboard },
    { key: "services" as Section, label: "Services", icon: Stethoscope },
    { key: "team" as Section, label: "Team", icon: UserRound },
    { key: "appointments" as Section, label: "Appointments", icon: Calendar },
    { key: "messages" as Section, label: "Messages", icon: Mail },
  ];

  const stats = [
    { label: "Services", value: services.length },
    { label: "Team", value: team.length },
    { label: "Appointments", value: appointments.length },
    { label: "Messages", value: messages.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 text-foreground">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[240px_1fr] min-h-screen">
        <aside className="border-r border-primary/15 p-4 bg-card/80 backdrop-blur">
          <h2 className="text-xl font-bold text-primary px-2 mb-4">Admin Panel</h2>
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                  section === item.key
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
          <Button variant="destructive" className="w-full mt-6" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </aside>

        <main className="p-6 space-y-6">
          {loading ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">Loading admin data...</CardContent>
            </Card>
          ) : null}

          {section === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.label} className="border-primary/15">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Appointments</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {appointments.slice(0, 5).map((a) => (
                      <div key={a.id} className="border rounded-lg p-3">
                        <p className="font-medium">
                          {a.firstName} {a.lastName} - {a.service}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {a.preferredDate} at {a.preferredTime}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {messages.slice(0, 5).map((m) => (
                      <div key={m.id} className="border rounded-lg p-3">
                        <p className="font-medium">{m.Name}</p>
                        <p className="text-xs text-muted-foreground">{m.Subject}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {section === "services" && (
            <div className="space-y-6">
              <Card className="border-primary/15">
                <CardHeader>
                  <CardTitle>{editingServiceId ? "Edit Service" : "Add Service"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid md:grid-cols-2 gap-4" onSubmit={handleServiceSubmit}>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={serviceForm.title}
                        onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <Input
                        value={serviceForm.icon}
                        onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Image</Label>
                      <Input type="file" accept="image/*" onChange={(e) => setServiceImage(e.target.files?.[0] || null)} />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Characteristics</Label>
                      <div className="flex gap-2">
                        <Input
                          value={serviceForm.featureInput}
                          onChange={(e) => setServiceForm({ ...serviceForm, featureInput: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addFeatureChip();
                            }
                          }}
                          placeholder="Type a characteristic and press Enter"
                        />
                        <Button type="button" variant="outline" onClick={addFeatureChip}>
                          Add
                        </Button>
                      </div>
                      {serviceForm.features.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {serviceForm.features.map((feature) => (
                            <button
                              key={feature}
                              type="button"
                              onClick={() => removeFeatureChip(feature)}
                              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary hover:bg-primary/20 transition-colors"
                              title="Click to remove"
                            >
                              {feature}
                              <span className="ml-2 text-[10px]">x</span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button type="submit">{editingServiceId ? "Update Service" : "Create Service"}</Button>
                      {editingServiceId ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingServiceId(null);
                            setServiceImage(null);
                            setServiceForm({ title: "", description: "", icon: "🦷", price: "", features: [], featureInput: "" });
                          }}
                        >
                          Cancel Edit
                        </Button>
                      ) : null}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <Card key={service.id} className="border-primary/15">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span>
                          {service.icon} {service.title}
                        </span>
                        <Badge>{service.price}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="flex gap-2 flex-wrap">
                        {(service.features ?? []).map((feature) => (
                          <Badge key={`${service.id}-${feature}`} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingServiceId(service.id);
                            setServiceForm({
                              title: service.title,
                              description: service.description,
                              icon: service.icon,
                              price: service.price,
                              features: [...(service.features ?? [])],
                              featureInput: "",
                            });
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" onClick={() => void deleteService(service.id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {section === "team" && (
            <div className="space-y-6">
              <Card className="border-primary/15">
                <CardHeader>
                  <CardTitle>{editingTeamId ? "Edit Team Member" : "Add Team Member"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="grid md:grid-cols-2 gap-4" onSubmit={handleTeamSubmit}>
                    <div>
                      <Label>Name</Label>
                      <Input value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} required />
                    </div>
                    <div>
                      <Label>Experience</Label>
                      <Input value={teamForm.experience} onChange={(e) => setTeamForm({ ...teamForm, experience: e.target.value })} />
                    </div>
                    <div>
                      <Label>Specialization</Label>
                      <Input
                        value={teamForm.specialization}
                        onChange={(e) => setTeamForm({ ...teamForm, specialization: e.target.value })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Photo</Label>
                      <Input type="file" accept="image/*" onChange={(e) => setTeamImage(e.target.files?.[0] || null)} />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Bio</Label>
                      <Textarea value={teamForm.bio} onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })} required />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button type="submit">{editingTeamId ? "Update Member" : "Create Member"}</Button>
                      {editingTeamId ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingTeamId(null);
                            setTeamImage(null);
                            setTeamForm({ name: "", role: "", bio: "", experience: "", specialization: "" });
                          }}
                        >
                          Cancel Edit
                        </Button>
                      ) : null}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                {team.map((member) => (
                  <Card key={member.id} className="border-primary/15">
                    <CardHeader className="pb-2">
                      <CardTitle>{member.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-medium text-sm">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                      <div className="text-xs text-muted-foreground">
                        <p>Specialization: {member.specialization || "-"}</p>
                        <p>Experience: {member.experience || "-"}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingTeamId(member.id);
                            setTeamForm({
                              name: member.name,
                              role: member.role,
                              bio: member.bio,
                              experience: member.experience || "",
                              specialization: member.specialization || "",
                            });
                          }}
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" onClick={() => void deleteTeamMember(member.id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {section === "appointments" && (
            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle>Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {appointments.map((appointment) => {
                  const canDelete = appointment.status === "cancelled" || appointment.status === "completed";
                  return (
                    <div
                      key={appointment.id}
                      className="p-3 rounded-lg border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium">
                          {appointment.firstName} {appointment.lastName} - {appointment.service}
                        </p>
                        <p className="text-sm text-muted-foreground">{appointment.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.preferredDate} at {appointment.preferredTime}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className="rounded-md border bg-background p-2 text-sm"
                          value={appointment.status}
                          onChange={(e) => void updateAppointmentStatus(appointment.id, e.target.value as Appointment["status"])}
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="cancelled">cancelled</option>
                          <option value="completed">completed</option>
                        </select>
                        <Badge variant="secondary" className="capitalize">
                          {appointment.status}
                        </Badge>
                        {canDelete ? (
                          <Button variant="destructive" onClick={() => void deleteAppointment(appointment.id)}>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {section === "messages" && (
            <Card className="border-primary/15">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="p-3 rounded-lg border space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{message.Name}</p>
                        <p className="text-xs text-muted-foreground">{message.Email}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => void deleteMessage(message.id)}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                    <p className="text-sm font-medium">{message.Subject}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{message.Message}</p>
                    <div className="text-xs text-muted-foreground">
                      {new Date(message.Message_date).toLocaleString()}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
