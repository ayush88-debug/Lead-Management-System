import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  if (loading && isEditing) return <div>Loading...</div>;

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Form Fields */}
              {Object.keys(form).map((key) => (
                <div key={key}>
                  <Label htmlFor={key} className="capitalize">{key.replace("_", " ")}</Label>
                  {typeof form[key] === "boolean" ? (
                    <Input
                      id={key}
                      name={key}
                      type="checkbox"
                      checked={form[key]}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  ) : (
                    <Input
                      id={key}
                      name={key}
                      type={typeof form[key] === "number" ? "number" : "text"}
                      value={form[key]}
                      onChange={handleChange}
                      required={
                        ["first_name", "last_name", "email", "source"].includes(
                          key
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : isEditing ? "Update Lead" : "Create Lead"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}