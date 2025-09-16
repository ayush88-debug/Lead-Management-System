import React, { useEffect, useState } from "react";
import * as api from "../api";
import { useAuth } from "../context/AuthProvider";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Leads() {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await api.getLeads(); // We will create this API function next
        setLeads(data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) return <div>Loading leads...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={() => navigate("/leads/new")}>Add Lead</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="w-full bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Company</th>
              <th className="p-3">Status</th>
              <th className="p-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b">
                <td className="p-3">{`${lead.first_name} ${lead.last_name}`}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.company}</td>
                <td className="p-3">{lead.status}</td>
                <td className="p-3">{lead.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}