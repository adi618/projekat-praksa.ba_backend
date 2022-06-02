import bcrypt from "bcrypt";
import Company from "../models/companyModel.js";

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select("-password");
    if (!companies) {
      return res.status(404).json({ message: "No companies found." });
    }

    res.status(200).json(companies);
  } catch (error) {
    res.status(404).json({ message: "No companies found" });
  }
};

export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).select("-password");
    if (!company) {
      return res.status(404).json({ message: "Account doesn't exist." });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(404).json({ message: "Company not found" });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Account doesn't exist." });
    }

    if (company.id == req.user.id) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      try {
        const updatedCompany = await Company.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true },
        );
        res.status(200).json(updatedCompany);
      } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "You can only update Your account" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Account doesn't exist." });
    }

    if (company.id == req.user.id) {
      try {
        await Company.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Account deleted" });
      } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "You can delete only your account" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
