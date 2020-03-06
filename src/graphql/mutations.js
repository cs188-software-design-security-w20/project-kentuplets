/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createItemTable = /* GraphQL */ `
  mutation CreateItemTable($input: CreateItemTableInput!) {
    createItemTable(input: $input) {
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
export const updateItemTable = /* GraphQL */ `
  mutation UpdateItemTable($input: UpdateItemTableInput!) {
    updateItemTable(input: $input) {
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
export const deleteItemTable = /* GraphQL */ `
  mutation DeleteItemTable($input: DeleteItemTableInput!) {
    deleteItemTable(input: $input) {
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
export const createLatestUserBidTable = /* GraphQL */ `
  mutation CreateLatestUserBidTable($input: CreateLatestUserBidTableInput!) {
    createLatestUserBidTable(input: $input) {
      lubtProductID
      Username
      BidAmt
    }
  }
`;
export const updateLatestUserBidTable = /* GraphQL */ `
  mutation UpdateLatestUserBidTable($input: UpdateLatestUserBidTableInput!) {
    updateLatestUserBidTable(input: $input) {
      lubtProductID
      Username
      BidAmt
    }
  }
`;
export const deleteLatestUserBidTable = /* GraphQL */ `
  mutation DeleteLatestUserBidTable($input: DeleteLatestUserBidTableInput!) {
    deleteLatestUserBidTable(input: $input) {
      lubtProductID
      Username
      BidAmt
    }
  }
`;
export const createKennysListUserTable = /* GraphQL */ `
  mutation CreateKennysListUserTable($input: CreateKennysListUserTableInput!) {
    createKennysListUserTable(input: $input) {
      username
      accountID
      randstring
    }
  }
`;
export const updateKennysListUserTable = /* GraphQL */ `
  mutation UpdateKennysListUserTable($input: UpdateKennysListUserTableInput!) {
    updateKennysListUserTable(input: $input) {
      username
      accountID
      randstring
    }
  }
`;
export const deleteKennysListUserTable = /* GraphQL */ `
  mutation DeleteKennysListUserTable($input: DeleteKennysListUserTableInput!) {
    deleteKennysListUserTable(input: $input) {
      username
      accountID
      randstring
    }
  }
`;
export const createUserBidsTable = /* GraphQL */ `
  mutation CreateUserBidsTable($input: CreateUserBidsTableInput!) {
    createUserBidsTable(input: $input) {
      ProductID
      Username
      BidAmt
      BidID
      Status
    }
  }
`;
export const updateUserBidsTable = /* GraphQL */ `
  mutation UpdateUserBidsTable($input: UpdateUserBidsTableInput!) {
    updateUserBidsTable(input: $input) {
      ProductID
      Username
      BidAmt
      BidID
      Status
    }
  }
`;
export const deleteUserBidsTable = /* GraphQL */ `
  mutation DeleteUserBidsTable($input: DeleteUserBidsTableInput!) {
    deleteUserBidsTable(input: $input) {
      ProductID
      Username
      BidAmt
      BidID
      Status
    }
  }
`;
