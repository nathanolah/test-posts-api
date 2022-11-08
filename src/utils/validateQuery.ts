const validField = (query: any, fields: string[]) => {
  let valid = false;

  if (query.length > 0) {
    // Compare the query parameter field against the known valid fields
    const validField = fields.find((field) => {
      return field === query;
    });

    if (validField !== undefined) {
      valid = true;
    }
  }

  return valid;
};

export const validateQuery = (query: any) => {
  // Known valid fields
  const sortByFields = ["id", "reads", "likes", "popularity"];
  const directionFields = ["asc", "desc"];

  // Validate authorIds parameter
  if (
    Object.keys(query).length <= 0 ||
    query.authorIds === undefined ||
    query.authorIds === ""
  ) {
    return { error: "authorIds is required" };
  }

  // Validate sortBy parameter
  if (query.sortBy !== undefined) {
    if (validField(query.sortBy, sortByFields) === false) {
      return {
        error:
          "SortBy is invalid. Parameters are id, reads, likes, or popularity",
      };
    }
  }

  // Validate direction parameter
  if (query.direction !== undefined) {
    if (validField(query.direction, directionFields) === false) {
      return { error: "direction is invalid. Parameters are asc, or desc" };
    }
  }

  return {};
};
