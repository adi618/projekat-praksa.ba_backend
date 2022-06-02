/* eslint-disable no-unused-expressions */
import mongoose from "mongoose";
import Company from "../models/companyModel.js";

// function isValidObjectId(id) {
//   if (mongoose.Types.ObjectId.isValid(id)) {
//     if ((String)(new mongoose.Types.ObjectId(id)) === id) { return true; }
//     return false;
//   }
//   return false;
// }

const queryResults = async (model, queryObject, skip = null, limit = null) => {
  const postsProp = (skip != null && limit != null) ? [{ $skip: skip }, { $limit: limit }] : [];

  const tempRes = await model.aggregate([
    { $match: queryObject },
    // { $sort: { [sort]: order } },
    {
      $facet: {
        posts: postsProp,
        totalCount: [{ $count: 'count' }],
      },
    },
  ]);

  await Company.populate(tempRes[0].posts, { path: "company" });
  return tempRes;
};

const paginatedResults = async (model, params) => {
  const page = params.page ? parseInt(params.page, 10) : null;
  const limit = params.limit ? parseInt(params.limit, 10) : null;
  const startIndex = (page != null && limit != null) ? (page - 1) * limit : null;
  const endIndex = (page != null && limit != null) ? page * limit : null;
  const results = {};

  const paramsQuery = {};
  params.id && (paramsQuery.company = mongoose.Types.ObjectId(params.id));
  params.city && (paramsQuery.location = params.city);
  params.cat && (paramsQuery.category = params.cat);

  const searchQuery = {
    $or: [
      { title: { $regex: params.search } },
      { location: { $regex: params.search } },
      { companyName: { $regex: params.search } },
    ],
  };

  const searchAndParamsQuery = {
    $and: [
      paramsQuery,
      searchQuery,
    ],
  };

  let result;
  try {
    if (params.search && (params.id || params.city || params.cat)) {
      result = await queryResults(model, searchAndParamsQuery, startIndex, limit);
    } else if (params.search) {
      result = await queryResults(model, searchQuery, startIndex, limit);
    } else if (params.id || params.city || params.cat) {
      result = await queryResults(model, paramsQuery, startIndex, limit);
    } else {
      result = await queryResults(model, {}, startIndex, limit);
    }

    results.results = result[0].posts;
    const resultsNum = result[0].totalCount[0].count;

    if (params.page && params.limit) {
      if (endIndex < parseInt(resultsNum, 10)) {
        results.next = { page: page + 1 };
      }

      if (startIndex > 0) {
        results.previous = { page: page - 1 };
      }

      const pagesNum = parseInt(resultsNum / limit, 10);
      results.numberOfPages = limit == 1 || limit == resultsNum
        ? pagesNum : pagesNum + 1;
    }

    return results;
  } catch (err) {
    return { message: "Something went wrong" };
  }
};

export default paginatedResults;
