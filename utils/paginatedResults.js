/* eslint-disable no-unused-expressions */
const paginatedResults = async (model, query) => {
  const page = parseInt(query.page, 10);
  const limit = parseInt(query.limit, 10);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  const qry = {};

  query.id && (qry.company = query.id);
  query.city && (qry.location = query.city);
  query.cat && (qry.category = query.cat);

  try {
    if (query.search && (query.id || query.city || query.cat)) {
      results.results = await model
        .find({
          $and: [
            qry,
            {
              $or: [
                { title: { $regex: query.search } },
                { location: { $regex: query.search } },
                { companyName: { $regex: query.search } },
              ],
            },
          ],
        })
        .populate("company")
        .select("-password")
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else if (query.search) {
      results.results = await model
        .find({
          $or: [
            { title: { $regex: query.search } },
            { location: { $regex: query.search } },
            { companyName: { $regex: query.search } },
          ],
        })
        .populate("company")
        .select("-password")
        .limit(limit)
        .skip(startIndex)
        .exec();
    } else if (query.id || query.city || query.cat) {
      results.results = await model
        .find(qry)
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
