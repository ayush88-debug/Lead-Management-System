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

export { createLead };