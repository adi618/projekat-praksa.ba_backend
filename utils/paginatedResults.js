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

  try {
    if (params.search && (params.id || params.city || params.cat)) {
      results.results = await model
        .find({
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
        })
        .populate("company")
        .select("-password")
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else if (params.search) {
      results.results = await model
        .find({
          $or: [
            { title: { $regex: params.search } },
            { location: { $regex: params.search } },
            { companyName: { $regex: params.search } },
          ],
        })
        .populate("company")
        .select("-password")
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else if (params.id || params.city || params.cat) {
      results.results = await model
        .find(queryObject)
        .populate("company")
        .select("-password")
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else {
      results.results = await model
        .find()
        .populate("company")
        .select("-password")
        .limit(limit)
        .skip(startIndex)
        .exec();
    }

    if (endIndex < (await model.countDocuments().exec())) {
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

    return results;
  } catch (err) {
    return { message: err.message };
  }
};

export default paginatedResults;
