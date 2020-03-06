/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getItemTable = /* GraphQL */ `
  query GetItemTable($itemID: String!) {
    getItemTable(itemID: $itemID) {
      itemID
      category
      description
      highestBidder
      images
      itemOwner
      name
      postTime
      condition
      marketPrice
      startingBid
    }
  }
`;
export const listItemTables = /* GraphQL */ `
  query ListItemTables(
    $filter: TableItemTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listItemTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        itemID
        category
        description
        highestBidder
        images
        itemOwner
        name
        postTime
        condition
        marketPrice
        startingBid
      }
      nextToken
    }
  }
`;
export const getLatestUserBidTable = /* GraphQL */ `
  query GetLatestUserBidTable($lubtProductID: String!) {
    getLatestUserBidTable(lubtProductID: $lubtProductID) {
      lubtProductID
      Username
      BidAmt
    }
  }
`;
export const listLatestUserBidTables = /* GraphQL */ `
  query ListLatestUserBidTables(
    $filter: TableLatestUserBidTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLatestUserBidTables(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        lubtProductID
        Username
        BidAmt
      }
      nextToken
    }
  }
`;
export const getKennysListUserTable = /* GraphQL */ `
  query GetKennysListUserTable($username: String!) {
    getKennysListUserTable(username: $username) {
      username
      accountID
      randstring
    }
  }
`;
export const listKennysListUserTables = /* GraphQL */ `
  query ListKennysListUserTables(
    $filter: TableKennysListUserTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listKennysListUserTables(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        username
        accountID
        randstring
      }
      nextToken
    }
  }
`;
export const getUserBidsTable = /* GraphQL */ `
  query GetUserBidsTable($Username: String!, $ProductID: String!) {
    getUserBidsTable(Username: $Username, ProductID: $ProductID) {
      ProductID
      Username
      BidAmt
      BidID
      Status
    }
  }
`;
export const listUserBidsTables = /* GraphQL */ `
  query ListUserBidsTables(
    $filter: TableUserBidsTableFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserBidsTables(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        ProductID
        Username
        BidAmt
        BidID
        Status
      }
      nextToken
    }
  }
`;
