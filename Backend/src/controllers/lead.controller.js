import Lead from "../models/lead.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

const createLead = asyncHandler(async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    company,
    city,
    state,
    source,
    status,
    score,
    lead_value,
  } = req.body;

  if (!first_name || !last_name || !email || !source) {
    throw new apiError(400, "Required fields are missing");
  }

  const existingLead = await Lead.findOne({ email });
  if (existingLead) {
    throw new apiError(400, "Lead with this email already exists");
  }

  const lead = await Lead.create({
    first_name,
    last_name,
    email,
    phone,
    company,
    city,
    state,
    source,
    status,
    score,
    lead_value,
  });

  return res
    .status(201)
    .json(new apiResponse(201, lead, "Lead created successfully"));
});

const getLeads = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    name,
    email,
    company,
    status,
    created_at,
  } = req.query;

  const query = {};

  if (name) {
    query.$or = [
      { first_name: { $regex: name, $options: "i" } },
      { last_name: { $regex: name, $options: "i" } },
    ];
  }

  if (email) query.email = { $regex: email, $options: "i" };
  if (company) query.company = { $regex: company, $options: "i" };
  if (status) query.status = { $regex: status, $options: "i" };
  
  // --- CORRECTED DATE LOGIC FOR A SINGLE DAY ---
  if (created_at) {
    // The date string from the query will be like "2025-09-18"
    const startOfDay = new Date(created_at);
    startOfDay.setUTCHours(0, 0, 0, 0); // Set to the beginning of the day in UTC

    const endOfDay = new Date(created_at);
    endOfDay.setUTCHours(23, 59, 59, 999); // Set to the end of the day in UTC

    query.createdAt = { $gte: startOfDay, $lte: endOfDay };
  }
  // --- END OF CORRECTION ---

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Lead.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        data: leads,
        page: pageNum,
        limit: limitNum,
        total: total,
        totalPages: totalPages,
      },
      "Leads retrieved successfully"
    )
  );
});

const getLeadById = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new apiError(404, "Lead not found");
  }
  return res
    .status(200)
    .json(new apiResponse(200, lead, "Lead retrieved successfully"));
});

const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!lead) {
    throw new apiError(404, "Lead not found");
  }
  return res
    .status(200)
    .json(new apiResponse(200, lead, "Lead updated successfully"));
});

const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    throw new apiError(404, "Lead not found");
  }
  return res.status(204).send();
});

export { createLead , getLeads, getLeadById, updateLead, deleteLead};