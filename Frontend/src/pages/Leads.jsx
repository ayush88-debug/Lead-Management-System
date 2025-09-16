import React, { useEffect, useState, useMemo, useCallback } from "react";
import * as api from "../api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "hooks-ts";
import { ViewLeadCard } from "@/components/ViewLeadCard"; 

export default function Leads() {
  const [data, setData] = useState({ leads: [], pagination: { page: 1, totalPages: 1 } });
  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    name: "",
    company: "",
    status: "",
    created_at: null,
  });
  
  // State for the dialog
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const debouncedFilters = useDebounce(filters, 500);

  const fetchLeads = useCallback(async () => {
    // ... fetchLeads function remains the same
    setLoading(true);
    try {
      const params = {
        page: paginationState.page,
        limit: paginationState.limit,
        ...debouncedFilters,
      };

      if (params.created_at) {
        params.created_at = params.created_at.toISOString().split("T")[0];
      }
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const responseData = await api.getLeads(params);
      setData({
        leads: responseData.data,
        pagination: {
          page: responseData.page,
          limit: responseData.limit,
          total: responseData.total,
          totalPages: responseData.totalPages,
        },
      });
    } catch (err) {
      setError(err.message || "Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [paginationState.page, paginationState.limit, debouncedFilters]);


  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleDelete = useCallback(async (id) => {
    // ... handleDelete function remains the same
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await api.deleteLead(id);
        fetchLeads();
      } catch (err) {
        setError(err.message || "Failed to delete lead");
      }
    }
  }, [fetchLeads]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFilters((prev) => ({ ...prev, status: value === "all" ? "" : value }));
  };
  
  const handlePageChange = (newPage) => {
    setPaginationState(prev => ({ ...prev, page: newPage }));
  };

  // Handler to open the view dialog
  const handleViewLead = (lead) => {
    setSelectedLead(lead);
    setIsViewOpen(true);
  };

  const tableColumns = useMemo(
    () => columns(navigate, handleDelete, handleViewLead),
    [navigate, handleDelete]
  );
  
  const statusOptions = ["new", "contacted", "qualified", "lost", "won"];

  if (loading && !data.leads.length) return <div className="p-4">Loading leads...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* View Lead Dialog */}
      <ViewLeadCard 
        lead={selectedLead}
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
      />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={() => navigate("/leads/new")}>Add Lead</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg">
         <Input
          name="name"
          placeholder="Filter by Name..."
          value={filters.name}
          onChange={handleFilterChange}
        />
        <Input
          name="company"
          placeholder="Filter by Company..."
          value={filters.company}
          onChange={handleFilterChange}
        />
        <Select onValueChange={handleStatusChange} value={filters.status || "all"}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-2">
            <DatePicker
            date={filters.created_at}
            setDate={(date) => setFilters({ ...filters, created_at: date })}
            />
            <Button variant="outline" size="sm" onClick={() => setFilters(prev => ({ ...prev, created_at: null }))}>Clear</Button>
        </div>
      </div>

      <DataTable
        columns={tableColumns}
        data={data.leads}
        pagination={data.pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}