const db = require("../config/dbpool");

const getColumnTypes = async (table) => {
  const query = `
    SELECT column_name, data_type, udt_name
    FROM information_schema.columns
    WHERE table_name = $1;
  `;
  const columns = await db.query(query, [table]);
  return columns.rows.filter(col => col.data_type === 'USER-DEFINED');
};

const dbQuery = async (query, values) => {
  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(error.message);
  }
};

const dbOperations = async (operation, table, data, conditions = {}) => {
  console.log(data)
  try {
    if (!operation || !table) {
      throw new Error("Invalid operation or table name");
    }

    let query = "";
    let values = [];
    let conditionClause = "";
    let conditionValues = [];

    if (Object.keys(conditions).length > 0) {
      conditionClause = "WHERE " + Object.keys(conditions).map((key, i) => `${key} = $${i + 1}`).join(" AND ");
      conditionValues = Object.values(conditions);
    }

    switch (operation.toLowerCase()) {
      case "insert": {
        const keys = Object.keys(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
        values = Object.values(data);
        query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`;
        break;
      }

      case "geom": {
        const columnTypes = await getColumnTypes(table);
        const geomColumns = columnTypes.filter(col => col.udt_name === "geography").map(col => col.column_name);

        if (geomColumns.length === 0) {
          throw new Error("No geography column found in table");
        }

        const keys = Object.keys(data);
        const nonGeomKeys = keys.filter(key => !geomColumns.some(geomCol => key.toLowerCase().includes(geomCol)));
        values = nonGeomKeys.map(key => data[key]);

        const geomValues = geomColumns.map(geomCol => {
          const longitudeKey = keys.find(key => key.toLowerCase() === `${geomCol}_longitude`);
          const latitudeKey = keys.find(key => key.toLowerCase() === `${geomCol}_latitude`);

          if (!longitudeKey || !latitudeKey) {
            throw new Error(`Missing longitude or latitude for geography column: ${geomCol}`);
          }

          return `ST_SetSRID(ST_MakePoint(${data[longitudeKey]}, ${data[latitudeKey]}), 4326)`;
        });

        query = `
          INSERT INTO ${table} (${[...nonGeomKeys, ...geomColumns].join(", ")})
          VALUES (${[...values.map((_, i) => `$${i + 1}`), ...geomValues].join(", ")})
          RETURNING *`;
        break;
      }

      case "update": {
        const keys = Object.keys(data);
        if (keys.length === 0) throw new Error("No data provided for update");
    
        const columnTypes = await getColumnTypes(table);
        const geomColumns = columnTypes
            .filter(col => col.udt_name === "geography")
            .map(col => col.column_name);
    
        // Separate non-geom columns
        const nonGeomKeys = keys.filter(
            key => !geomColumns.some(geomCol => key.toLowerCase().includes(geomCol))
        );
    
        let values = nonGeomKeys.map(key => data[key]);
        let setClauseParts = nonGeomKeys.map((key, i) => `${key} = $${i + 1}`);
    
        let geomValues = [];
        if (geomColumns.length > 0) {
            geomColumns.forEach((geomCol) => {
                const longitudeKey = keys.find(key => key.toLowerCase() === `${geomCol}_longitude`);
                const latitudeKey = keys.find(key => key.toLowerCase() === `${geomCol}_latitude`);
    
                if (!longitudeKey || !latitudeKey) {
                    throw new Error(`Missing longitude or latitude for geography column: ${geomCol}`);
                }
    
                // Use correct parameter indexing
                setClauseParts.push(`${geomCol} = ST_SetSRID(ST_MakePoint($${values.length + 1}, $${values.length + 2}), 4326)`);
                geomValues.push(data[longitudeKey], data[latitudeKey]);
            });
        }
    
        // Construct full SET clause
        const fullSetClause = setClauseParts.join(", ");
    
        // Ensure ID is last parameter
        values = [...values, ...geomValues, conditions.id];
    
        // Explicitly cast id to INTEGER
        query = `UPDATE ${table} SET ${fullSetClause} WHERE id = $${values.length}::INTEGER RETURNING *`;
        console.log(query)
        console.log(values)
        result=await dbQuery(query, values);
        console.log(result)
        return result;
    }
    
    
    

      case "delete": {
        query = `DELETE FROM ${table} ${conditionClause} RETURNING *`;
        values = conditionValues;
        break;
      }

      case "select": {
        query = `SELECT * FROM ${table}`;
        break;
      }

      default:
        throw new Error("Invalid operation type");
    }
   qry=await dbQuery(query, values);
  //  result=db.query(qry)
  //  return result.rows;
    return await dbQuery(query, values);
  } catch (error) {
    console.error("Operation Error:", error);
    throw new Error(error.message);
  }
};

module.exports = { dbOperations };
