/* eslint-disable no-unused-expressions */
const paginatedResults = async (model, params) => {
  const page = parseInt(params.page, 10);
  const limit = parseInt(params.limit, 10);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  const queryObject = {};
  let tempRes;

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
      tempRes = await model.aggregate([
        { $match: {} },
        // { $sort: { [sort]: order } },
        // { $project: { password: 0, avatarData: 0, tokens: 0 } },
        {
          $facet: {
            posts: [{ $skip: startIndex }, { $limit: limit }],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);

      results.results = tempRes[0].posts;
    // console.log(results.results[0]);
    // console.log({ users: result[0].users });
    // console.log(result[0].totalCount[0].count);
    }

    if (endIndex < parseInt(tempRes[0].totalCount[0].count, 10)) {
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

    const pageNum = parseInt(tempRes[0].totalCount[0].count / limit, 10);
    results.numberOfPages = limit == 1
      ? pageNum : pageNum + 1;
    return results;
  } catch (err) {
    return { message: err.message };
  }
};

export default paginatedResults;
