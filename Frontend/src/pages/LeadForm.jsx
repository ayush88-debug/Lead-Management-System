import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// List of fields to exclude from manual rendering
const excludedFields = [
  "_id", "id", "createdAt", "updatedAt", "__v", 
  "status", "source", "is_qualified", "last_activity_at"
];

export default function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: "",
    lead_value: "",
    is_qualified: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(id);

  // Enum options for dropdowns
  const statusOptions = ["new", "contacted", "qualified", "lost", "won"];
  const sourceOptions = ["website", "facebook_ads", "google_ads", "referral", "events", "other"];

  useEffect(() => {
    if (isEditing) {
      const fetchLead = async () => {
        setLoading(true);
        try {
          const data = await api.getLeadById(id);
          setForm(data);
        } catch (err) {
          setError(err.message || "Failed to fetch lead");
        } finally {
          setLoading(false);
        }
      };
      fetchLead();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked) => {
    setForm((prev) => ({ ...prev, is_qualified: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isEditing) {
        await api.updateLead(id, form);
      } else {
        await api.createLead(form);
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to save lead");
    } finally {
      setLoading(false);
    }
  };
  
  const formFields = Object.keys(form).filter(key => !excludedFields.includes(key));

  if (loading && isEditing) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Lead" : "Create Lead"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the details of the existing lead."
              : "Fill in the details to create a new lead."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Standard Text/Number Inputs */}
              {formFields.map((key) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="capitalize">{key.replace(/_/g, " ")}</Label>
                  <Input
                    id={key}
                    name={key}
                    type={key.includes("value") || key.includes("score") ? "number" : "text"}
                    value={form[key] || ''}
                    onChange={handleChange}
                    required={["first_name", "last_name", "email"].includes(key)}
                  />
                </div>
              ))}

              {/* Source Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select onValueChange={(value) => handleSelectChange('source', value)} value={form.source}>
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select a source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map(option => (
                      <SelectItem key={option} value={option} className="capitalize">{option.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => handleSelectChange('status', value)} value={form.status}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option} value={option} className="capitalize">{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Is Qualified Switch */}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_qualified" 
                  checked={form.is_qualified} 
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_qualified">Is Qualified</Label>
              </div>
            </div>
            
            {error && <p className="text-red-500 pt-2">{error}</p>}
            
            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Saving..." : isEditing ? "Update Lead" : "Create Lead"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}