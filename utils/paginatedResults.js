/* eslint-disable no-unused-expressions */
const paginatedResults = async (model, params) => {
  const page = parseInt(params.page, 10);
  const limit = parseInt(params.limit, 10);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  const queryObject = {};

  params.id && (queryObject.company = params.id);
  params.city && (queryObject.location = params.city);
  params.cat && (queryObject.category = params.cat);

  const searchAndParamsQuery = {
    $and: [
      queryObject,
      {
        $or: [
          { title: { $regex: params.search } },
          { location: { $regex: params.search } },
          { companyName: { $regex: params.search } },
        ],
      },
    ],
  };

  const searchQuery = {
    $or: [
      { title: { $regex: params.search } },
      { location: { $regex: params.search } },
      { companyName: { $regex: params.search } },
    ],
  };

  try {
    if (params.search && (params.id || params.city || params.cat)) {
      results.results = await model
        .find(searchAndParamsQuery)
        .populate("company")
        .select("-password")
        .limit(limit)
        .skip(startIndex)
        .exec();

      results.numberOfResults = await model.find(searchAndParamsQuery).count();
    } else if (params.search) {
      results.results = await model
        .find(searchQuery)
        .populate("company")
        .select("-password")
        .limit(limit)
        .skip(startIndex)
        .exec();

      results.numberOfResults = await model.find(searchQuery).count();
    } else if (params.id || params.city || params.cat) {
      results.results = await model
        .find(queryObject)
        .populate("company")
        .select("-password")
        .limit(limit)
        .skip(startIndex)
        .exec();

      results.numberOfResults = await model.find(queryObject).count();
    } else {
      results.results = await model
        .find()
        .populate("company")
        .select("-password")
        .limit(limit)
        .skip(startIndex)
        .exec();

      results.numberOfResults = await model.find().count();
    }

    if (endIndex < results.numberOfResults) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }

    results.numberOfPages = parseInt(results.numberOfResults / limit, 10) + 1;

    return results;
  } catch (err) {
    return { message: err.message };
  }
};

export default paginatedResults;
