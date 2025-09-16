import React, { useEffect, useState, useMemo, useCallback } from "react";
import * as api from "../api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/data-table"; 
import { columns } from "@/components/columns"; 
import { DatePicker } from "@/components/ui/date-picker"; 
import { Input } from "@/components/ui/input";
import { useDebounce } from "hooks-ts";

export default function Leads() {
  const [data, setData] = useState({ leads: [], pagination: { page: 1, totalPages: 1 } });
  const [paginationState, setPaginationState] = useState({
    page: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    email: "",
    company: "",
    status: "",
    created_at: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const debouncedFilters = useDebounce(filters, 500);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationState.page,
        limit: paginationState.limit,
        ...debouncedFilters,
      };

      if (params.created_at) {
        params.created_at = params.created_at.toISOString().split('T')[0];
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
  
  const handlePageChange = (newPage) => {
    setPaginationState(prev => ({ ...prev, page: newPage }));
  };

  const tableColumns = useMemo(
    () => columns(navigate, handleDelete),
    [navigate, handleDelete]
  );

  if (loading && !data.leads.length) return <div>Loading leads...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={() => navigate("/leads/new")}>Add Lead</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg">
        <Input
          name="email"
          placeholder="Filter by Email..."
          value={filters.email}
          onChange={handleFilterChange}
        />
        <Input
          name="company"
          placeholder="Filter by Company..."
          value={filters.company}
          onChange={handleFilterChange}
        />
        <Input
          name="status"
          placeholder="Filter by Status..."
          value={filters.status}
          onChange={handleFilterChange}
        />
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