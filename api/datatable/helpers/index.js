const normalizeSortValue = (value) => {
  if (value === undefined) {
    return 1;
  }

  if (value === -1 || value === "-1" || value.toLowerCase() === "desc") {
    return -1;
  }

  return 1;
};

const queryToAggregateClauses = (query) => {
  const { filters, sort, pagination } = query;
  const tunedPagination = {
    page: 1,
    pageSize: 20,
    pageCount: 0,
    total: 0,
  };

  if (pagination) {
    if (pagination.page !== undefined) {
      tunedPagination.page = pagination.page;
    }
    if (pagination.pageSize !== undefined) {
      tunedPagination.pageSize = pagination.pageSize;
    }
  }

  const matchClause = {};
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (!matchClause[key]) {
        matchClause[key] = {};
      }

      if (typeof value === "string") {
        matchClause[key]["$eq"] = value;
      } else if (typeof value === "object") {
        for (const [op, opValue] of Object.entries(value)) {
          switch (op) {
            case "$eq":
            case "$gt":
            case "$gte":
            case "$lt":
            case "$lte":
            case "$in":
              matchClause[key][op] = opValue;
          }
        }
      }
    }
  }

  const sortClause = {};
  if (sort) {
    if (typeof sort === "string") {
      const pairs = sort.split(",").map((pair) => pair.split(":"));
      for (const pair of pairs) {
        sortClause[pair[0]] = normalizeSortValue(pair[1]);
      }
    }
    // else if (Array.isArray(sort)) {
    //   for (const sortItem of sort) {
    //     if (typeof sort === "object") {
    //       try {
    //         const [key, value] = Object.entries(sort)[0];
    //         sortClause[key] = normalizeSortValue(value);
    //       } finally {
    //       }
    //     }
    //   }
    // }
  } else {
    sortClause["_id"] = 1;
  }

  const skipClause = {
    $skip: (tunedPagination.page - 1) * tunedPagination.pageSize,
  };
  const limitClause = {
    $limit: tunedPagination.pageSize,
  };

  return {
    matchClause,
    sortClause,
    skipClause,
    limitClause,
    pagination: tunedPagination,
  };
};

module.exports = {
  getResultsFromAggregateAndQuery: async (
    aggregate,
    query,
    additionalClauses = []
  ) => {
    const { matchClause, sortClause, skipClause, limitClause, pagination } =
      queryToAggregateClauses(query);

    const result = await aggregate
      .match(matchClause)
      .sort(sortClause)
      .facet({
        data: [...additionalClauses, skipClause, limitClause],
        meta: [
          {
            $count: "total",
          },
          {
            $project: {
              pagination: {
                total: "$total",
              },
            },
          },
        ],
      })
      .unwind("$meta")
      .exec()
      .then((res) => res[0]);

    result.meta.pagination = {
      total: result.meta.pagination.total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      pageCount: Math.ceil(result.meta.pagination.total / pagination.pageSize),
    };

    return result;
  },
};
