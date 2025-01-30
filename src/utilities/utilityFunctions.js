export const buildQueryOptions = (query, searchFields = []) => {
    const { search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, pageSize = 10, filters = '' } = query;

    // Parse filters string into an array of conditions
    const filterConditions = filters ? filters.split('||').map(condition => {
        return condition.split('&&').map(expr => {
            const [column, value] = expr.split('=');
            return { [column.trim()]: value.trim() };
        });
    }) : [];

    // Construct the where clause based on filters
    let whereClause = {};

    filterConditions.forEach(conditions => {
        conditions.forEach(condition => {
            whereClause = { ...whereClause, ...condition };
        });
    });

    // Convert search term into a regular expression for partial matches (if applicable)
    if (search && searchFields.length > 0) {
        const searchConditions = searchFields.map(field => ({
            [field]: new RegExp(search, 'i')
        }));

        // Add search conditions to the where clause
        if (searchConditions.length > 0) {
            whereClause.$or = searchConditions;
        }
    }

    // Construct the Mongoose query options
    const options = {
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
        limit: parseInt(pageSize),
        skip: (parseInt(page) - 1) * parseInt(pageSize)
    };

    return { whereClause, options };
};
