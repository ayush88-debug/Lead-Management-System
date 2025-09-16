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
    limit = 20,
    email,
    company,
    city,
    status,
    source,
    score,
    lead_value,
    created_at,
    last_activity_at,
    is_qualified,
  } = req.query;

  const query = {};

  if (email) query.email = { $regex: email, $options: "i" };
  if (company) query.company = { $regex: company, $options: "i" };
  if (city) query.city = { $regex: city, $options: "i" };
  if (status) query.status = status;
  if (source) query.source = source;
  if (score) query.score = Number(score);
  if (lead_value) query.lead_value = Number(lead_value);
  if (is_qualified) query.is_qualified = is_qualified === "true";
  
  // Basic date filtering
  if (created_at) query.created_at = { $gte: new Date(created_at) };
  if (last_activity_at)
    query.last_activity_at = { $gte: new Date(last_activity_at) };

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
  };

  const leads = await Lead.paginate(query, options);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        data: leads.docs,
        page: leads.page,
        limit: leads.limit,
        total: leads.totalDocs,
        totalPages: leads.totalPages,
      },
      "Leads retrieved successfully"
    )
  );
});

export { createLead , getLeads};