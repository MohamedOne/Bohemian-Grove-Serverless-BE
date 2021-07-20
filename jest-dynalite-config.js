module.exports = {
  tables: [
    {
      TableName: "bg-data",
      KeySchema: [
        { AttributeName: "dataType", KeyType: "HASH" },
        { AttributeName: "dataKey", KeyType: "RANGE" }
      ],
      AttributeDefinitions: [
        { AttributeName: "dataType", AttributeType: "S" },
        { AttributeName: "dataKey", AttributeType: "S" },
        { AttributeName: "displayName", AttributeType: "S" }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: "displayName-index",
          KeySchema: [
            {
              AttributeName: "displayName",
              KeyType: "HASH"
            }
          ],
          Projection: {
            ProjectionType: "ALL"
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          }
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    }
  ],
  basePort: 8000,
};